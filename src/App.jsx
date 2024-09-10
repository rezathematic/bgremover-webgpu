import { useState, useCallback } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useImageProcessor } from './hooks/useImageProcessor'
import { ImageDropzone } from './components/image-dropzone'
import { ImageGrid } from "./components/image-grid";
import { ErrorDisplay } from './components/error-display'
import { LoadingDisplay } from './components/loading-display'
import { copyToClipboard, downloadImage } from './lib'
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "@radix-ui/react-icons"


export default function App() {
  const [images, setImages] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloadReady, setIsDownloadReady] = useState(false);

  const { processImage, isLoading, error } = useImageProcessor();

  const onDrop = useCallback((acceptedFiles) => {
    setImages((prevImages) => [
      ...prevImages,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }, []);

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setProcessedImages((prevProcessed) =>
      prevProcessed.filter((_, i) => i !== index),
    );
  };

  const processImages = async () => {
    setIsProcessing(true);
    setProcessedImages([]);
    const promises = images.map((src) => processImage(src));
    const results = await Promise.all(promises);
    setProcessedImages(results);
    setIsProcessing(false);
    setIsDownloadReady(true);
  };

  const downloadAsZip = async () => {
    const zip = new JSZip();
    const promises = processedImages.map((image, i) =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = image;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              zip.file(`image-${i + 1}.png`, blob);
            }
            resolve(null);
          }, "image/png");
        };
      })
    );
    await Promise.all(promises);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "images.zip");
  };

  const clearAll = () => {
    setImages([]);
    setProcessedImages([]);
    setIsDownloadReady(false);
  };

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (isLoading) {
    return <LoadingDisplay />;
  }

  return (
    <div className="min-h-dvh bg-neutral-200 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Remove Background Using WebGPU</h1>
      <ImageDropzone onDrop={onDrop} />
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex gap-4">
        <Button onClick={processImages} disabled={isProcessing || images.length === 0} >
          {isProcessing ? "Processing..." : "Process"}
        </Button>
          <Button variant='destructive' onClick={clearAll}>Clear All</Button>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={downloadAsZip} disabled={!isDownloadReady} className={
            !isDownloadReady ? 'hidden' : 'flex'
          }><DownloadIcon className="mr-2 h-4 w-4" />Download as ZIP</Button>
        </div>
      </div>
      <ImageGrid
        images={images}
        processedImages={processedImages}
        onRemove={removeImage}
        onCopy={copyToClipboard}
        onDownload={downloadImage}
      />
    </div>
  );
}