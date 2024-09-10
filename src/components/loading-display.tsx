import React from "react";

export const LoadingDisplay = () => {
  return (
    <div className="min-h-dvh bg-neutral-200 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-800 mb-4"></div>
        <p className="text-lg">Loading background removal model...</p>
      </div>
    </div>
  );
};