import React from "react";
import { useDropzone } from "react-dropzone";

export const ImageDropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 mb-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 mx-auto max-w-3xl ease-in-out
        ${isDragAccept ? "border-green-500 bg-green-900/20" : ""}
        ${isDragReject ? "border-red-500 bg-red-900/20" : ""}
        ${isDragActive ? "border-blue-500 bg-blue-900/20" : "border-gray-700 hover:border-blue-500 hover:bg-blue-900/10"}
      `}
    >
      <input {...getInputProps()} className="hidden" />
      <p className="text-lg mb-2">{isDragActive ? "Drop the images here..." : "Drag and drop some images here"}</p>
      <p className="text-sm text-gray-400">or click to select files</p>
    </div>
  );
};
