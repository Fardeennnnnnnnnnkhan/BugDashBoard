const express = require("express");
const router = express.Router();
const { createTaskReview , fetchAllReview} = require("../../controllers/ReviewAndFeedbackControllers/ReviewController");
const { upload, uploadToGridFS,getFileFromGridFS } = require("../../config/multerOfConfig");

// router.post("/create" ,upload, uploadToGridFS,taskReviewController.createTaskReview);
router.get("/allreview/:taskId",fetchAllReview );

router.post("/create",
    upload, 
    uploadToGridFS,
    createTaskReview
);  
router.get("/file/:id", getFileFromGridFS);


module.exports = router;