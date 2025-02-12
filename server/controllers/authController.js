// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const transporter = require('../config/email');

// // User signup (first-time request)
// exports.register = async (req, res) => {
//     const { username, email, password } = req.body;

//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ message: 'Email already exists' });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ username, email, password: hashedPassword, isVerified: false });
//         await newUser.save();

//         sendVerificationEmail(newUser);

//         res.status(201).json({ message: 'User registered successfully. Awaiting admin approval.' });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Admin approval/rejection via email
// exports.verifyUser = async (req, res) => {
//     const { userId } = req.params;
//     const isApproved = req.query.approve === 'true'; 

//     try {
//         const user = await User.findById(userId);
//         if (!user) return res.status(404).send('<h2>User not found</h2>');

//         if (isApproved) {
//             user.isVerified = true;
//             await user.save();
//             sendApprovalEmail(user, true);
//             res.send('<h2 style="color: green;">User approved successfully! They can now log in.</h2>');
//         } else {
//             await User.findByIdAndDelete(userId);
//             sendApprovalEmail(user, false);
//             res.send('<h2 style="color: red;">User rejected. They cannot register.</h2>');
//         }
//     } catch (error) {
//         res.status(500).send('<h2>Error processing request</h2>');
//     }
// };

// // User login (only verified users)
// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         if (!user.isVerified) return res.status(403).json({ message: 'Your account is pending admin approval' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.status(200).json({ token, user });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Send verification email to admin
// const sendVerificationEmail = (user) => {
//     const approveLink = `${process.env.BASE_URL}/api/auth/verify-user/${user._id}?approve=true`;
//     const rejectLink = `${process.env.BASE_URL}/api/auth/verify-user/${user._id}?approve=false`;

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: process.env.ADMIN_EMAIL,
//         subject: 'New User Registration Approval Needed',
//         html: `
//             <p>A new user has registered:</p>
//             <p><strong>Username:</strong> ${user.username}<br><strong>Email:</strong> ${user.email}</p>
//             <p>Click below to approve or reject:</p>
//             <a href="${approveLink}" style="padding: 10px; background-color: green; color: white;">✅ Approve</a>
//             <a href="${rejectLink}" style="padding: 10px; background-color: red; color: white; margin-left: 10px;">❌ Reject</a>
//         `,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) console.log('Error sending email:', error);
//         else console.log('Approval email sent:', info.response);
//     });
// };

// // Notify user after approval/rejection
// const sendApprovalEmail = (user, isApproved) => {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: `Your Account Has Been ${isApproved ? 'Approved' : 'Rejected'}`,
//         text: isApproved
//             ? `Congratulations! Your account has been approved. You can now log in.`
//             : `Sorry, your account request has been rejected.`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) console.log('Error sending email:', error);
//         else console.log('User approval/rejection email sent:', info.response);
//     });
// };
