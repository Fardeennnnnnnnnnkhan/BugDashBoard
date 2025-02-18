const taskService = require("../Services/taskServices");

// ✅ Create a new task
exports.createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body);
        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update a task
exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await taskService.updateTask(req.params.taskId, req.body);
        if (!updatedTask) return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Task updated", updatedTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await taskService.deleteTask(req.params.taskId);
        if (!deletedTask) return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Task deleted", deletedTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update Task Status
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status, updatedBy } = req.body;
        const { taskId } = req.params;

        const updatedTask = await taskService.updateTaskStatus(taskId, status, updatedBy);
        if (!updatedTask) return res.status(404).json({ message: "Task not found" });

        res.status(200).json({ message: "Task status updated successfully", updatedTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
