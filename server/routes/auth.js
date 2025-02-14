const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const transporter = require("../config/email");
const router = express.Router();
const authMiddleware  = require('../middleware/authMiddleware');

require("dotenv").config();

// ✅ User Signup (Only Coach & Hunter)
// ✅ User Signup (Only Coach & Hunter)
router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        if (role !== "coach" && role !== "hunter") {
            return res.status(400).json({ message: "Only Coach and Hunter can register" });
        }

        // ✅ Check if the username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken. Please choose a different username." });
        }

        const existingPendingUsername = await PendingUser.findOne({ username });
        if (existingPendingUsername) {
            return res.status(400).json({ message: "Username already taken. Please choose a different username." });
        }

        // ✅ Check if the user is already approved
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

            if (!existingUser.isVerified) {
                return res.status(403).json({ message: "User not approved by admin." });
            }

            const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            const redirectUrl = existingUser.role === "coach" ? "/coach-dashboard" : "/hunter-dashboard";

            return res.status(200).json({ token, user: existingUser, redirectUrl });
        }

        // ✅ Check if the user is already pending approval
        const existingPendingUser = await PendingUser.findOne({ email });
        if (existingPendingUser) {
            return res.status(400).json({ message: "Approval pending. Please wait for admin confirmation." });
        }

        // ✅ If not found in either collection, create a new pending user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newPendingUser = new PendingUser({ username, email, password: hashedPassword, role });

        await newPendingUser.save();
        sendVerificationEmail(newPendingUser);

        return res.status(201).json({ message: "Registration request sent. Awaiting admin approval." });

    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});


// ✅ Admin Approval
router.post("/approve-user", async (req, res) => {
    try {
        const { pendingUserId } = req.body;

        if (!pendingUserId) {
            return res.status(400).json({ message: "Pending user ID is required." });
        }

        // Find the pending user
        const pendingUser = await PendingUser.findById(pendingUserId);
        if (!pendingUser) {
            return res.status(404).json({ message: "Pending user not found." });
        }

        // ✅ Check if a user with the same username already exists
        const existingUserByUsername = await User.findOne({ username: pendingUser.username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: "Username already taken. Please choose a different username." });
        }

        // ✅ Check if a user with the same email already exists
        const existingUserByEmail = await User.findOne({ email: pendingUser.email });
        if (existingUserByEmail) {
            return res.status(400).json({ message: "Email already registered. Please use a different email." });
        }

        // Insert new user if checks pass
        await User.create({
            username: pendingUser.username,
            email: pendingUser.email,
            password: pendingUser.password, // Ensure it's already hashed
            role: pendingUser.role,
        });

        // ✅ Delete from pending collection
        await PendingUser.findByIdAndDelete(pendingUserId);

        return res.status(200).json({ message: "User approved successfully!" });

    } catch (error) {
        console.error("Error approving user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 🔹 Check if user is approved
        if (!user.isApproved) {
            return res.status(403).json({ message: "Your account is not approved yet." });
        }

        // 🔹 Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 🔹 Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // 🔹 Redirect URL based on role
        let redirectUrl = "";
        if (user.role === "coach") {
            redirectUrl = "/coach-dashboard";
        } else if (user.role === "hunter") {
            redirectUrl = "/hunter-dashboard";
        }

        return res.status(200).json({ token, user, redirectUrl });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.get("/coach-dashboard", authMiddleware, (req, res) => {
    if (req.user.role !== "coach") {
        return res.status(403).json({ message: "Access denied" });
    }
    res.json({ message: "Welcome to the Coach Dashboard!" });
});

router.get("/hunter-dashboard", authMiddleware, (req, res) => {
    if (req.user.role !== "hunter") {
        return res.status(403).json({ message: "Access denied" });
    }
    res.json({ message: "Welcome to the Hunter Dashboard!" });
});


// ✅ Reject User
router.post("/reject-user", async (req, res) => {
    const { userId } = req.body;
    try {
        const pendingUser = await PendingUser.findById(userId);
        if (!pendingUser) return res.status(404).json({ message: "User not found" });

        await PendingUser.findByIdAndDelete(userId);
        sendApprovalEmail(pendingUser, false);

        res.status(200).json({ message: "User rejected successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error rejecting user." });
    }
});

// ✅ Fetch All Pending Users
router.get("/pending-users", async (req, res) => {
    try {
        const pendingUsers = await PendingUser.find();
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending users" });
    }
});


// ✅ Helper Functions for Emails
const sendVerificationEmail = (user) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: "New User Registration Approval Needed",
        html: `<p>A new user has registered: ${user.username}</p>
               <p><strong>Email:</strong> ${user.email}</p>
               <p><strong>Role:</strong> ${user.role}</p>`
    };
    transporter.sendMail(mailOptions);
};

const sendApprovalEmail = (user, isApproved) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Your Account Has Been ${isApproved ? "Approved" : "Rejected"}`,
        text: isApproved
            ? `Congratulations! Your account has been approved. You can now log in.`
            : `Sorry, your account request has been rejected.`,
    };
    transporter.sendMail(mailOptions);
};

module.exports = router;
