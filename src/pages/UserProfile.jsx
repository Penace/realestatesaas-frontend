import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserById } from "../services/api";
import { useToast } from "../context/ToastProvider";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchUserById(id);
        setUser(data);
      } catch (err) {
        console.error(err);
        showToast("Failed to load user profile", "error");
      }
    }
    loadUser();
  }, [id]);

  if (!user) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl space-y-4">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Currency:</strong> {user.currency || "N/A"}
        </p>
        <p>
          <strong>Approved:</strong> {user.approved ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}
