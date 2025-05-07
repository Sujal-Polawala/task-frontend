const User = require("../models/user"); // Import the User model
const auth = require("../middleware/authMiddleware"); // Ensure the user is authenticated

exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("notifications");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Fetched notifications:", user.notifications); // <- Add this log

    res.json(user.notifications.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};
