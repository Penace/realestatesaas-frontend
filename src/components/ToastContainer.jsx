export default function ToastContainer({ toasts = [] }) {
  return (
    <div className="fixed top-5 right-5 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded shadow-lg text-white ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
