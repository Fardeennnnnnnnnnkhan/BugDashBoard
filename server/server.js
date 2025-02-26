// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const userRoutes = require('./routes/auth');
// const adminRoutes = require('./routes/adminRoutes');
// const taskRoute = require('./routes/taskRoutes');
// const taskReviewRoutes = require('./routes/ReviewAndFeedback/reviewRoutes');
// const finalReportRoutes = require('./routes/ReviewAndFeedback/finalReviewRoutes');
// //const scriptRoutes = require('./routes/scriptRoutes'); // This should export an Express router for script endpoints
// const scriptRoutes = require('./routes/scriptRoutes');

// dotenv.config();

// const app = express();

// // Use built-in middleware
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// connectDB();

// // Define API routes
// app.use('/api/auth', userRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/task', taskRoute);
// app.use('/api/taskReview', taskReviewRoutes);
// app.use('/api/finalReport', finalReportRoutes);
// //app.use('/api/scripts', scriptRoutes); // This route handles script creation/fetching
// //const scriptRoutes = require('./routes/scriptRoutes');
// app.use('/api/scripts', scriptRoutes);

// // Fallback route (should be last)
// app.use("/", (req, res) => {
//     res.send("Connected to backend...");
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const taskRoute = require('./routes/taskRoutes');
const taskReviewRoutes = require('./routes/ReviewAndFeedback/reviewRoutes');
const finalReportRoutes = require('./routes/ReviewAndFeedback/finalReviewRoutes');
const scriptRoutes = require('./routes/scriptRoutes');

// Import your Script model
const Script = require('./models/ScriptModel');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// A function to insert short sample data
async function insertSampleData() {
  try {
    // Insert a few shorter sample records
    await Script.insertMany([
      {
        category: "Fingerprinting Application",
        activity: "Bruteforce sub domains",
        tools_technique: `Dnsdumster.com

builtwith.com

Sublist3r`
      },
      {
        category: "Network Testing",
        activity: "Test for ping",
        tools_technique: "Ping CMD"
      },
      {
        category: "Application Mapping",
        activity: "Generate site structure",
        tools_technique: "Manual and Freemind tool."
      }
    ]);

    console.log("✅ Short sample scripts inserted successfully!");
  } catch (error) {
    console.error("❌ Error inserting sample scripts:", error);
  }
}

// Connect to MongoDB
connectDB()
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Insert the short sample data
    await insertSampleData();

    // Define API routes
    app.use('/api/auth', userRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/task', taskRoute);
    app.use('/api/taskReview', taskReviewRoutes);
    app.use('/api/finalReport', finalReportRoutes);
    app.use('/api/scripts', scriptRoutes);

    // Fallback route
    app.use("/", (req, res) => {
      res.send("Connected to backend...");
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
