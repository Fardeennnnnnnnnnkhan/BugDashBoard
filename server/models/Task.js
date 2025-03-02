const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskId: { type: String, required: true, unique: true }, // Unique Task ID
    projectName: { type: String, required: true },          // Project Name
    industry: { type: String, required: true },
    DomainLink: { type: String, required: false },
    Batch : {type : String , require:false},             
    toolLink: { type: String, required: false },            // Optional Tool Link
    status: { type: String, required: true, enum: ["Unclaimed", "In Progress", "Completed","Reviewed" , "Deliver"] }, // Status Enum
    lastUpdated: { type: Date, default: Date.now },         
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "TaskReview" }] ,
    finalReview: { type: mongoose.Schema.Types.ObjectId, ref: "FinalReport" } ,
    updatedBy: { type: String, required: true }             // User who updated it
});

// Export the model
module.exports = mongoose.model("Task", taskSchema);

