import { Fragment } from "react";

export default function ModalConfirm({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600">{description}</p>

        <div className="flex justify-center gap-6 pt-4">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <Fragment>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </Fragment>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
