const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Import route files
const userRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminRoutes");
const taskRoutes = require("./routes/taskRoutes");
const taskReviewRoutes = require("./routes/ReviewAndFeedback/reviewRoutes");
const finalReportRoutes = require("./routes/ReviewAndFeedback/finalReviewRoutes");
const scriptRoutes = require("./routes/scriptRoutes");
const textRoutes = require("./routes/textRoutes");
const videoRoutes = require("./routes/videoRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");

    // Define API routes
    app.use("/api/auth", userRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/task", taskRoutes);
    app.use("/api/taskReview", taskReviewRoutes);
    app.use("/api/finalReport", finalReportRoutes);
    app.use("/api/scripts", scriptRoutes);
    app.use("/api/texts", textRoutes);
    app.use("/api/videos", videoRoutes);

    // Fallback route
    app.get("/", (req, res) => {
      res.send("Connected to backend...");
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
