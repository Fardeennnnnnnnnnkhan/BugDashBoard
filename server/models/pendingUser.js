const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
    username: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["coach", "hunter"], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);
