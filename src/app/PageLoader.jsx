// src/components/PageLoader.jsx
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function PageLoader({ isLoading, children }) {
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <LoadingSpinner size={32} />
      </div>
    );
  }
  return children;
}
