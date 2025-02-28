// videoRoutes.js
const express = require("express");
const router = express.Router();
const { getVideoDocs } = require("../controllers/videoController");

// Example route
router.get("/", getVideoDocs);




// Export the router directly
module.exports = router;
