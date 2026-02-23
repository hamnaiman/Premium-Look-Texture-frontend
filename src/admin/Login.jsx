import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      localStorage.setItem("adminToken", data.token);
      window.location.href = "/admin/dashboard";
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">

        {/* Logo / Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-600">
            Admin Login
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Secure access to your dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center mb-4 font-medium bg-red-50 py-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter admin email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition shadow"
          >
            Login
          </button>

        </form>

        {/* Footer Highlight */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Admin Panel • Crafted with{" "}
            <span className="text-green-500 font-semibold">Passion</span>
          </p>
        </div>

      </div>
    </div>
  );
}
