"use client";
import { useState } from "react";
import { loginUser } from "@/api/auth";
import { saveToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return false;
    }
    return true;
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { token, user } = await loginUser({ email, password });
      saveToken(token);
      localStorage.setItem("userId", user.id);
      toast.success("Login successful!");
      clearForm();
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("User does not exist. Please register first.");
      } else if (err.response?.status === 401) {
        toast.error("Incorrect password. Try again");
      } else {
        toast.error("Login failed. Please try again.");
      }
      clearForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-800 rounded-2xl p-8 shadow-2xl border border-zinc-700 animate-fadeIn">
        <h2 className="text-3xl font-bold text-teal-400 text-center mb-6">
          Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-teal-500 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            } transition-all duration-200 text-white font-semibold py-2 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] hover:cursor-pointer`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Footer or Note */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register`}
            className="text-teal-400 hover:underline cursor-pointer"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
