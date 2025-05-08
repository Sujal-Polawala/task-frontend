"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTaskById, updateTask } from "@/api/tasks";
import toast from "react-hot-toast";

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = useParams();
  const todayISO = new Date().toISOString().split("T")[0];

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  });

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getTaskById(id, token);
        
        // Format dueDate to YYYY-MM-DD if it exists
        const formattedDueDate = data.dueDate
          ? new Date(data.dueDate).toISOString().split("T")[0]
          : "";
  
        setTask({
          ...data,
          dueDate: formattedDueDate,
        });
      } catch (err) {
        alert("Failed to load task");
      }
    };
  
    fetchTask();
  }, [id]);  

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const selectedDate = new Date(task.dueDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      alert("Please select today or a future date.");
      return;
    }
    try {
      await updateTask(id, task, token);
      toast.success("Task updated successfully!");
      router.push("/tasks");
    } catch (err) {
      if (err?.response?.status === 403) {
        toast.error("Only the creator of this task can update it.");
      } else {
        toast.error("Error updating task");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-teal-400 mb-6">✏️ Edit Task</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-zinc-700 space-y-5"
        >
          <div>
            <label className="block text-sm mb-1 text-gray-300">Title</label>
            <input
              type="text"
              name="title"
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
              value={task.description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              min={todayISO} // prevents selection of past dates
              className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            <label className="block text-sm mb-1 text-gray-300">Status</label>
            <select
              name="status"
              value={task.status}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Start">Start</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition"
          >
            Update Task
          </button>
        </form>
      </div>
    </div>
  );
}
