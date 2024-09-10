import React from "react";
import { Button } from "@/components/ui/button"

export const ImageGrid = ({ images, processedImages, onRemove, onCopy, onDownload }) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((src, index) => (
          <div key={index} className="relative group">
            <img
              src={processedImages[index] || src}
              alt={`Image ${index + 1}`}
              className="rounded-lg object-cover w-full aspect-square"
            />
            {processedImages[index] && (
              <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <button
                  onClick={() => onCopy(processedImages[index] || src)}
                  className="mx-2 px-3 py-1 bg-white text-gray-900 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm"
                >
                  Copy
                </button>
                <button
                  onClick={() => onDownload(processedImages[index] || src)}
                  className="mx-2 px-3 py-1 bg-white text-gray-900 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm"
                >
                  Download
                </button>
              </div>
            )}
            <button
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
            >
              &#x2715;
            </button>
          </div>
        ))}
      </div>
    );
  };
  