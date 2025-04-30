import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import Button from "../components/common/Button";
import TextInput from "../components/form/TextInput";
import { useToast } from "../context/ToastProvider";

const roles = ["user", "agent", "admin"];

export default function SignUp() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, role } = form;

    if (!email || !password || !confirmPassword) {
      return showToast("All fields are required", "error");
    }

    if (password !== confirmPassword) {
      return showToast("Passwords do not match", "error");
    }

    try {
      setSubmitting(true);
      const hashed = await bcrypt.hash(password, 10);

      const approved = role === "user"; // auto-approved

      const newUser = {
        email,
        password: hashed,
        role,
        approved,
        createdAt: Date.now(),
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error("Failed to create user");

      if (approved) {
        localStorage.setItem("currentUser", JSON.stringify({ email, role }));
        showToast("Account created and logged in!", "success");
        navigate("/");
      } else {
        showToast("Account created. Awaiting approval.", "success");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gray-50">
      <div className="w-full max-w-md space-y-6 bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Create an Account
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextInput
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
          <TextInput
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
          <TextInput
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
          />

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-800"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role[0].toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              variant="primaryLight"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Sign Up"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
