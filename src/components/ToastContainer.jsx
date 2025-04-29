export default function ToastContainer({ toasts = [] }) {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col space-y-4 z-[9999]">
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
