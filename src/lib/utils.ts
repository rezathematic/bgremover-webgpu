import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const copyToClipboard = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const clipboardItem = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([clipboardItem]);
    console.log("Image copied to clipboard");
  } catch (err) {
    console.error("Failed to copy image: ", err);
  }
};

export const downloadImage = (url) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "image.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
