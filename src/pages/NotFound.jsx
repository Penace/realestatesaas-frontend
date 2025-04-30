import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-white text-center space-y-6">
      <h1 className="text-5xl font-bold text-gray-900">404</h1>
      <p className="text-lg text-gray-600">
        Sorry, the page you are looking for doesn't exist.
      </p>
      <div className="flex space-x-4">
        <Button variant="cta" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primaryLight" to="/">
          Go Home
        </Button>
      </div>
    </div>
  );
}
