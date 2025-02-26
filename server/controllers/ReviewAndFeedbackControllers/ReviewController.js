const TaskReview = require("../../models/TaskReview/TaskReviewAndFeedback");



// Create Task Review with File Uploads
exports.createTaskReview = async (req, res) => {
    try {
        // console.log("swapnil on controller" , req.uploadedFiles[1]["supportFile"])

        const { taskId, observedBehavior, vulnerabilities, reviewBy } = req.body;
        if (!req.files || (!req.files["scriptFile"] && !req.files["supportFile"])) {
            return res.status(400).json({ error: "No files uploaded" });
        }
        const scriptFiles = req.uploadedFiles[0]["scriptFile"]
        const supportFiles = req.uploadedFiles[1]["supportFile"]
        // console.log("swapnil on controller")
        // console.log(supportFiles)
        // Check if file IDs exist
        if (scriptFiles.length === 0) {
            return res.status(500).json({ error: "Script file upload failed" });
        }
        console.log(taskId)
        const taskReview = new TaskReview({
            taskId,
            scriptId: [], // Assuming scripts are referenced separately
            scriptFile: scriptFiles || null, // Store first file reference
            supportFile: supportFiles || null,
            observedBehavior,
            vulnerabilities,
            reviewBy
        });

        await taskReview.save();
        console.log("swapnil herer",taskReview)
        res.status(201).json({ message: "Task review created successfully", taskReview });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

exports.fetchAllReview = async(req,res)=>{
    try{
        console.log("swapnil is here")
        const allTask = await TaskReview.find({taskId:req.params.taskId});
        console.log(allTask);
        res.status(201).json({message:"all task fetch successfully", allTask});
    }
    catch(error){
        console.log(error)
        res.status(500).json({error:error.message});
    }
}

exports.reviewFeedback = async(req,res)=>{
    try{
        console.log("swapnil is here")
        const feedback = await TaskReview.findOneAndUpdate(
            {_id : req.params.reviewId},
            {feedBack : req.body.feedBack},
            { new :true},
        )
        res.status(200).json({message:"feedback send", feedback});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}

exports.deleteReview = async(req,res)=>{
    try{
        const deleteReview = await TaskReview.deleteOne({_id:req.params.id});
        res.status(200).json({message:"delete successfully"});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}


