// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import Button from "../components/common/Button";
import TextInput from "../components/form/TextInput";
import { useToast } from "../context/ToastProvider";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/users/email/${form.email.toLowerCase()}`
      );
      if (!res.ok) {
        showToast("Invalid credentials", "error");
        return;
      }
      const user = await res.json();
      if (!user) {
        showToast("Invalid credentials", "error");
        return;
      }

      console.warn("User object:", user);
      if (!user.passwordHash) {
        showToast("Account is missing a password hash.", "error");
        return;
      }
      const match = await bcrypt.compare(form.password, user.passwordHash);
      if (!match) {
        showToast("Invalid credentials", "error");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      showToast(`Welcome back, ${user.name || "user"}!`, "success");

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "agent") {
        navigate("/publish");
      } else {
        navigate("/");
      }

      // Force reload to update UI (e.g., Navbar)
      window.location.reload();
    } catch (err) {
      console.error("Login error:", err);
      showToast("Login failed. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        className="bg-white p-8 rounded-xl shadow-md space-y-6 w-full max-w-md"
        onSubmit={handleLogin}
      >
        <h1 className="text-3xl font-bold text-center text-gray-900">Log In</h1>

        <TextInput
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          placeholder="user@example.com"
        />

        <TextInput
          name="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
        />

        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            variant="primaryLight"
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
}
