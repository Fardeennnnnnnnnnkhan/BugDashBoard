const Task = require("../../models/Task");
const finalReportService = require("../../Services/ReviewAndFeedbackServices/finalReviewServices");

// Create or Update Final Report
exports.createOrUpdateFinalReport = async (req, res) => {
    try {
    console.log("swapnil herer", req.body);
        // const 
        const updatedReport = await Task.findOneAndUpdate(
            { _id:req.body.taskId }, // Find report by taskId
            { $set: { status:"Completed", lastUpdated: new Date() } }, // Update status
            { new: true, upsert: true } // Return updated doc, create if not found
          );
        const report = await finalReportService.createOrUpdateFinalReport(req.body);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Final Report by taskId
exports.getFinalReportByTaskId = async (req, res) => {
    try {
        const report = await finalReportService.getFinalReportByTaskId(req.params.taskId);
        if (!report) {
            return res.status(404).json({ message: "Final report not found for this taskId" });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
