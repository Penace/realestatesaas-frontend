export default function ToastContainer({ toasts = [], dismiss }) {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col-reverse items-start space-y-4 space-y-reverse z-[9999] max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex justify-between items-center px-4 py-2 rounded shadow-lg text-white transition-opacity duration-300 ease-in-out ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => dismiss(toast.id)}
            className="ml-4 text-white text-lg leading-none hover:opacity-80"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
