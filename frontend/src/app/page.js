"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyTasks } from "@/api/tasks";
import { getToken } from "@/utils/auth";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const [tasks, setTasks] = useState({});
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const fetchTasks = async () => {
      try {
        const data = await getMyTasks(token);
        setTasks({
          assignedTasks: data.filter((t) => t.assignedTo?._id === userId),
          createdTasks: data.filter((t) => t.createdBy?._id === userId),
          overdueTasks: data.filter((t) => {
            const due = new Date(t.dueDate);
            return due < new Date() && t.status !== "Completed";
          }),
        });
      } catch (err) {
        alert("Failed to load tasks");
      }
    };

    fetchTasks();
  }, [router]);

  // Extract tasks from state with default values
  const { assignedTasks = [], createdTasks = [], overdueTasks = [] } = tasks;

  const renderTaskCard = (task) => (
    <Link href={`/tasks/${task._id}`} key={task._id}>
      <div
        key={task._id}
        className="bg-zinc-800/70 backdrop-blur-lg rounded-2xl p-5 shadow-md hover:shadow-zinc-600 transition-shadow duration-300 border border-zinc-700"
      >
        <h3 className="text-xl font-semibold text-teal-400 mb-2">
          {task.title}
        </h3>
        <p className="text-sm text-gray-300 mb-3">{task.description}</p>
        <div className="flex justify-between text-sm text-gray-400">
          <span>📅 {new Date(task.createdAt).toLocaleDateString()}</span>
          <span
            className={`px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wide ${
              task.status === "Completed"
                ? "bg-green-600 text-white"
                : "bg-yellow-600 text-white"
            }`}
          >
            {task.status || "Pending"}
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white">
        <div className="sticky top-0 z-50 bg-zinc-900">
          <Navbar />
        </div>
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-4xl font-extrabold mb-10 tracking-tight">
            🧩 Task Dashboard
          </h1>

          <Link href="/tasks">
            <div className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-full shadow-lg cursor-pointer z-50">
              🔍 View All Tasks
            </div>
          </Link>

          {/* Assigned Tasks */}
          <Section
            title="📌 Tasks Assigned to You"
            tasks={assignedTasks}
            renderTaskCard={renderTaskCard}
          />

          {/* Created Tasks */}
          <Section
            title="✍️ Tasks You Created"
            tasks={createdTasks}
            renderTaskCard={renderTaskCard}
          />

          {/* Overdue Tasks */}
          <Section
            title="⏰ Overdue Tasks"
            tasks={overdueTasks}
            renderTaskCard={renderTaskCard}
            warning
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}

function Section({ title, tasks, renderTaskCard, warning = false }) {
  return (
    <div className="mb-12">
      <h2
        className={`text-2xl font-bold mb-4 ${
          warning ? "text-red-500" : "text-teal-300"
        }`}
      >
        {title}
      </h2>
      {tasks.length === 0 ? (
        <p className="text-gray-400 mb-6 italic">
          No tasks found in this section.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(renderTaskCard)}
        </div>
      )}
    </div>
  );
}
