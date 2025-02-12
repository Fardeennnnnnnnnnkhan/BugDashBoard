const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const transporter = require("../config/email");
const PendingUser = require("../models/pendingUser"); // Create a separate model for pending users

const router = express.Router();

// Temporary storage for unapproved users
let pendingUsers = {};

// ✅ User Signup (Only Coach & Hunter)

router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        if (role !== "coach" && role !== "hunter") {
            return res.status(400).json({ message: "Only Coach and Hunter can register" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const existingPendingUser = await PendingUser.findOne({ email });
        if (existingPendingUser) return res.status(400).json({ message: "Approval pending. Please wait for admin confirmation." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newPendingUser = new PendingUser({ username, email, password: hashedPassword, role });
        await newPendingUser.save();

        sendVerificationEmail(newPendingUser);

        res.status(201).json({ message: "Registration request sent. Awaiting admin approval." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//admin approval request
router.post("/approve-user", async (req, res) => {
    console.log("Request Body:", req.body);
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    
    try {
        const pendingUser = await PendingUser.findById(userId);
        if (!pendingUser) return res.status(404).json({ message: "User not found" });

        const newUser = new User({
            // username: pendingUser.username,
            email: pendingUser.email,
            password: pendingUser.password,
            role: pendingUser.role,
            isVerified: true
        });

        await newUser.save();
        await PendingUser.findByIdAndDelete(userId);
        
        sendApprovalEmail(newUser, true);
        res.status(200).json({ message: "User approved successfully." });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error approving user." });
    }
});

router.post("/reject-user", async (req, res) => {
    const { userId } = req.body;

    try {
        const pendingUser = await PendingUser.findById(userId);
        if (!pendingUser) return res.status(404).json({ message: "User not found" });

        await PendingUser.findByIdAndDelete(userId); // Remove from pending list
        sendApprovalEmail(pendingUser, false);

        res.status(200).json({ message: "User rejected successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error rejecting user." });
    }
});

// ✅ Admin Approval via Email
router.get("/verify-user", async (req, res) => {
    const { email, approve } = req.query;
    const isApproved = approve === "true";

    try {
        const userData = pendingUsers[email];
        if (!userData) return res.status(404).send("<h2>User not found or already processed</h2>");

        if (isApproved) {
            const newUser = new User(userData);
            await newUser.save();
            sendApprovalEmail(userData, true);
            delete pendingUsers[email];

            return res.send("<h2 style='color: green;'>User approved successfully! They can now log in.</h2>");
        } else {
            sendApprovalEmail(userData, false);
            delete pendingUsers[email];

            return res.send("<h2 style='color: red;'>User rejected. They cannot register.</h2>");
        }
    } catch (error) {
        res.status(500).send("<h2>Error processing request</h2>");
    }
});

//fetching all the pending user 
router.get("/pending-users", async (req, res) => {
    try {
        const pendingUsers = await PendingUser.find();
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending users" });
    }
});



// ✅ User Login (Only if Approved)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Send Verification Email to Admin
const sendVerificationEmail = (user) => {
    const approveLink = `${process.env.BASE_URL}/api/auth/verify-user?email=${user.email}&approve=true`;
    const rejectLink = `${process.env.BASE_URL}/api/auth/verify-user?email=${user.email}&approve=false`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: "New User Registration Approval Needed",
        html: `
            <p>A new user has registered:</p>
            <p><strong>Name:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p>Click below to approve or reject:</p>
            <a href="${approveLink}" style="padding: 10px; background-color: green; color: white;">✅ Approve</a>
            <a href="${rejectLink}" style="padding: 10px; background-color: red; color: white; margin-left: 10px;">❌ Reject</a>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log("Error sending email:", error);
        else console.log("Approval email sent:", info.response);
    });
};


// ✅ Notify User After Approval/Rejection
const sendApprovalEmail = (userData, isApproved) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userData.email,
        subject: `Your Account Has Been ${isApproved ? "Approved" : "Rejected"}`,
        text: isApproved
            ? `Congratulations! Your account has been approved. You can now log in.`
            : `Sorry, your account request has been rejected.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log("Error sending email:", error);
        else console.log("User approval/rejection email sent:", info.response);
    });
};

module.exports = router;
