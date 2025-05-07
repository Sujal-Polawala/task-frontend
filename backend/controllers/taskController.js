const Task = require("../models/Task");
const User = require("../models/user"); // Import the User model
const notifyUser = require("../utils/notifyUser"); 

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo")
      .populate("createdBy");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo")
      .populate("createdBy");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user.id });

    if (task.assignedTo) {
      await notifyUser(task.assignedTo, task);
      task.notified = true;
      await task.save();
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Task creation failed', error: err.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id; // assuming your auth middleware sets req.user
    const { title, description, priority, status, dueDate } = req.body;
    const taskId = req.params.id;

    // Step 1: Fetch the task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Step 2: Check ownership
    if (task.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this task" });
    }

    // Step 3: Update the task
    task.title = title;
    task.description = description;
    task.priority = priority;
    task.status = status;
    task.dueDate = dueDate;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id; // assuming you're setting req.user in auth middleware

    // Find the task first
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the current user is the creator
    if (task.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: Not your task" });
    }

    // Delete the task
    await Task.findByIdAndDelete(taskId);

    // Remove notifications related to this task from all users
    await User.updateMany(
      {},
      { $pull: { notifications: { taskId: taskId } } }
    );

    res.json({ message: "Task and related notifications deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
