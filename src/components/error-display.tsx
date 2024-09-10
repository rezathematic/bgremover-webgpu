import React from "react";

export const ErrorDisplay = ({ error }) => {
    return (
      <div className="min-h-dvh bg-neutral-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl mb-2">ERROR</h2>
          <p className="text-xl max-w-[500px]">{error.message}</p>
        </div>
      </div>
    );
  };
  