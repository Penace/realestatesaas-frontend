import { createPortal } from "react-dom";

export default function ModalConfirm({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500">{description}</p>
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition shadow-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
