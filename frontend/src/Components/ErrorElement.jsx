import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorElement = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      <div className="mb-4">
        <svg
          className="w-16 h-16 text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h1>
      <p className="text-md text-gray-600 mb-4">
        {error?.statusText || error?.message || "An unexpected error occurred."}
      </p>
      {error?.status && (
        <p className="text-sm text-gray-500">Error code: {error.status}</p>
      )}
      <a
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition"
      >
        Go to Home
      </a>
    </div>
  );
};

export default ErrorElement;
