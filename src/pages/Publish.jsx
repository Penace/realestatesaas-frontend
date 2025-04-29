import { useState } from "react";
import Button from "../components/Button";

export default function Publish() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Publish Your Listing
      </h1>
      <p className="text-gray-600 max-w-xl text-center mb-8">
        This is a placeholder for the listing submission form. Soon, users will
        be able to list properties directly through the platform.
      </p>

      {submitted ? (
        <p className="text-green-600 text-lg font-medium">
          Submission received!
        </p>
      ) : (
        <Button size="lg" variant="primary" onClick={() => setSubmitted(true)}>
          Submit Your Listing
        </Button>
      )}
    </div>
  );
}
