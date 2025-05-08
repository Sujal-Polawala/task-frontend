"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTask } from "@/api/tasks";
import { getUsers } from "@/api/auth";
import toast from "react-hot-toast";

export default function CreateTaskPage() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toISOString().split("T")[0];
  const todayISO = today.toISOString().split("T")[0];
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: tomorrowISO,
    priority: "Medium",
    status: "Start",
    assignedTo: "",
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchUsersAndNotifications = async () => {
      const token = localStorage.getItem("token");

      // ✅ Fetch users
      const data = await getUsers(token);
      if (!data) {
        toast.error("Failed to load users");
        return;
      }
      setUsers(data);

      // ✅ Fetch notifications
    };

    fetchUsersAndNotifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const selectedDate = new Date(task.dueDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // normalize time

    if (selectedDate < now) {
      toast.error("Please select today or a future date.");
      return;
    }

    try {
      await createTask(task, token);
      router.push("/tasks"); // ✅ redirect after task creation
    } catch (err) {
      alert("Error creating task");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-teal-400 mb-6">
          📝 Create Task
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-zinc-700 space-y-5"
        >
          <div>
            <label className="block text-sm mb-1 text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter task title"
              value={task.title}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter task description"
              value={task.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              min={todayISO} // restrict selection to today or later
              className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500 hover:cursor-pointer"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Assign To
            </label>
            <select
              name="assignedTo"
              value={task.assignedTo}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}
