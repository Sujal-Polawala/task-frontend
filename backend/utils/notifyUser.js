const User = require("../models/user");

const notifyUser = async (userId, task) => {
  const user = await User.findById(userId);
  if (!user) return;

  const message = `Hello ${user.name}, you have been assigned a new task: "${task.title}"`;

  // ✅ Store notification in DB for later
  user.notifications.push({ message, taskId: task._id });
  await user.save();

  console.log(`🔔 Notification (live or stored): ${message}`);
};

module.exports = notifyUser;
