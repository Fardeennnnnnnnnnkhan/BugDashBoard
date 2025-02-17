const Task = require("../models/Task");

// ✅ Create a new task
exports.createTask = async (req, res) => {
    try {
        
        const taskData = {
            ...req.body,
            lastUpdated: req.body.lastUpdated || Date.now(),
        };

        const task = new Task(taskData);
        await task.save();
        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        console.log("swapnil")
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update a task
exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { taskId: req.params.taskId },
            { ...req.body, lastUpdated: Date.now() },
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Task updated", updatedTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ taskId: req.params.taskId });
        if (!deletedTask) return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Task deleted", deletedTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateTaskStatus = async (req, res) => {
    try {
        const { status, updatedBy } = req.body;
        const { taskId } = req.params;

        // Validate status value
        const allowedStatuses = ["Pending", "In Progress", "Completed"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Update the status and timestamp
        const updatedTask = await Task.findOneAndUpdate(
            { taskId },
            { status, updatedBy, lastUpdated: Date.now() },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task status updated successfully", updatedTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

