import { useEffect, useState } from "react";
import { fetchPendingUsers, approveUser, rejectUser } from "../../services/api";
import ModalConfirm from "../../components/common/ModalConfirm";
import Button from "../../components/common/Button";
import { useToast } from "../../context/ToastProvider";
import UserCard from "../../components/UserCard";

export default function UserModeration() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      const users = await fetchPendingUsers();
      const unapproved = users.filter((user) => user.approved === false);
      setPendingUsers([...unapproved]);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch users", "error");
    }
  };

  const openModal = (user, mode) => {
    setSelectedUser(user);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalMode(null);
  };

  const handleConfirm = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      if (modalMode === "approve") {
        await approveUser(selectedUser._id);
        showToast("User approved!", "success");
      } else {
        await rejectUser(selectedUser._id);
        showToast("User rejected!", "success");
      }
      await loadPending();
    } catch (err) {
      console.error(err);
      showToast("Action failed. Please try again.", "error");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-6 bg-gray-50 space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-10">Moderate Users</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {pendingUsers.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            No pending users.
          </p>
        )}
        {pendingUsers.map((user) => (
          <UserCard
            key={user._id}
            id={user._id}
            name={user.name}
            email={user.email}
            role={user.role}
            currency={user.currency}
            actions={[
              <Button
                key="approve"
                variant="approve"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  openModal(user, "approve");
                }}
              >
                Approve
              </Button>,
              <Button
                key="reject"
                variant="reject"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  openModal(user, "reject");
                }}
              >
                Reject
              </Button>,
            ]}
          />
        ))}
      </div>

      <ModalConfirm
        isOpen={!!selectedUser}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={
          modalMode === "approve" ? "Approve this user?" : "Reject this user?"
        }
        description="This action cannot be undone."
        loading={loading}
      />
    </div>
  );
}
