"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMyTasks } from "@/api/tasks";
import { getToken } from "@/utils/auth";
import { getNotifications } from "@/api/notification";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");

  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const userId = localStorage.getItem("userId");
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        if (userId) {
          const notificationsData = await getNotifications(userId, token);
          console.log("Notifications:", notificationsData);
          if (!notificationsData) {
            toast.error("Failed to load notifications");
            return;
          }
          setNotifications(notificationsData);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
        alert("Failed to load notifications");
      }
    };

    const fetchTasks = async () => {
      try {
        const data = await getMyTasks(token);
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
        alert("Failed to load tasks");
      }
      setLoading(false);
    };

    fetchNotifications();
    fetchTasks();
  }, [router]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight

    const result = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.priority.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || task.status === statusFilter;

      const matchesPriority =
        !priorityFilter || task.priority === priorityFilter;

      const taskDueDate = new Date(task.dueDate); // assuming `dueDate` exists
      taskDueDate.setHours(0, 0, 0, 0); // normalize

      let matchesDueDate = true;
      if (dueDateFilter === "today") {
        matchesDueDate = taskDueDate.getTime() === today.getTime();
      } else if (dueDateFilter === "past") {
        matchesDueDate = taskDueDate < today;
      } else if (dueDateFilter === "upcoming") {
        matchesDueDate = taskDueDate > today;
      }

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesDueDate
      );
    });

    setFilteredTasks(result);
  }, [searchTerm, tasks, statusFilter, priorityFilter, dueDateFilter]);

  if (loading) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-semibold text-teal-400">📋 My Tasks</h1>
          <Link
            href="/tasks/create"
            className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-full shadow-xl transition duration-300 ease-in-out"
          >
            ➕ Create Task
          </Link>
        </div>
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-2/3 bg-zinc-800 text-white border border-teal-500 rounded-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-lg"
          />
        </div>
        <div className="mb-6 flex flex-wrap justify-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-800 text-white border border-teal-500 rounded-lg px-4 py-2 hover:cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="Start">Start</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-zinc-800 text-white border border-teal-500 rounded-lg px-4 py-2 hover:cursor-pointer"
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={dueDateFilter}
            onChange={(e) => setDueDateFilter(e.target.value)}
            className="bg-zinc-800 text-white border border-teal-500 rounded-lg px-4 py-2 hover:cursor-pointer"
          >
            <option value="">Any Due Date</option>
            <option value="today">Due Today</option>
            <option value="past">Past Due</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-400">No tasks found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                onClick={() => router.push(`/tasks/${task._id}`)}
                className="bg-zinc-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-zinc-700 hover:shadow-zinc-600 transition-shadow hover:cursor-pointer duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-teal-300 truncate w-4/5">
                    {task.title}
                  </h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold uppercase ${
                      task.priority === "High"
                        ? "bg-red-600"
                        : task.priority === "Low"
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    } text-white`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                  {task.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span className="w-1/3 truncate">
                    📅 Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  <span className="w-1/3 truncate">
                    📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      task.status === "Start"
                        ? "bg-yellow-400 text-gray-800"
                        : task.status === "In Progress"
                        ? "bg-blue-400 text-gray-800"
                        : "bg-green-400 text-gray-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="mt-4">
                  <Link
                    href={`/tasks/edit/${task._id}`}
                    className="text-teal-400 hover:underline hover:text-teal-300 font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ✏️ Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {notifications.length > 0 && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mt-6">
          <h2 className="text-xl font-semibold text-teal-400 mb-4">
            🔔 Notifications
          </h2>
          <ul className="space-y-3">
            {notifications.map((notif, idx) => (
              <li
                key={idx}
                className="bg-zinc-900 p-3 rounded-lg border border-zinc-700"
              >
                <p className="text-white">{notif.message}</p>
                <p className="text-sm text-gray-400">
                  {new Date(notif.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
