"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTaskById, deleteTask } from "@/api/tasks";
import { getToken } from "@/utils/auth";
import Navbar from "@/components/Navbar";
import { Trash2, Edit3, Clock, FileText, Info, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTask = async () => {
      try {
        const data = await getTaskById(id, token);
        setTask(data);
      } catch (err) {
        alert("Failed to load task details");
      }
    };

    fetchTask();
  }, [id, router]);

  const handleDelete = async () => {
    const token = getToken();
    if (!token) return;

    try {
      await deleteTask(id, token);
      setShowModal(false);
      toast.success("Task deleted successfully");
      router.push("/");
    } catch (err) {
      if (err.response.status === 403) {
        toast.error("You are not authorized to delete this task");
      } else {
        toast.error("Failed to delete task");
      }
    }
  };

  if (!task) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg border border-zinc-700">
          <h1 className="text-4xl font-bold mb-6 text-teal-400 flex items-center gap-3">
            <FileText size={28} /> {task.title}
          </h1>

          <p className="mb-4 text-lg text-gray-300 flex items-center gap-2">
            <Info size={20} /> {task.description}
          </p>

          <div className="text-sm text-gray-400 space-y-2 mb-6">
            <p className="flex items-center gap-2">
              <Clock size={18} /> Created At:{" "}
              {new Date(task.createdAt).toLocaleString()}
            </p>
            <p className="flex items-center gap-2">
              <Edit3 size={18} /> Status:{" "}
              <span className="ml-1 text-white">
                {task.status || "Pending"}
              </span>
            </p>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => router.push(`/tasks/edit/${task._id}`)}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl flex items-center gap-2 transition hover:cursor-pointer"
            >
              <Edit3 size={18} /> Edit
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl flex items-center gap-2 transition hover:cursor-pointer"
            >
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6 w-[90%] max-w-md animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-red-400 flex items-center gap-2">
                <XCircle size={22} /> Confirm Deletion
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white hover:cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              Are you absolutely sure you want to{" "}
              <span className="text-red-500 font-semibold">
                permanently delete
              </span>{" "}
              this Feeling? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm text-white hover:cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
