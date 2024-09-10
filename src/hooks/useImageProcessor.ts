'use client'
import { useState, useEffect, useRef } from "react";
import { env, AutoModel, AutoProcessor, RawImage } from "@huggingface/transformers";

export const useImageProcessor = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const modelRef = useRef(null);
  const processorRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        if (!navigator.gpu) {
          throw new Error("WebGPU is not supported in this browser.");
        }
        const model_id = "Xenova/modnet";
        env.backends.onnx.wasm.proxy = false;
        modelRef.current ??= await AutoModel.from_pretrained(model_id, {
          device: "webgpu",
        });
        processorRef.current ??= await AutoProcessor.from_pretrained(model_id);
      } catch (err) {
        setError(err);
      }
      setIsLoading(false);
    })();
  }, []);

  const processImage = async (imageSrc) => {
    const model = modelRef.current;
    const processor = processorRef.current;
    const img = await RawImage.fromURL(imageSrc);
    const { pixel_values } = await processor(img);
    const { output } = await model({ input: pixel_values });

    const maskData = (
      await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(img.width, img.height)
    ).data;

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img.toCanvas(), 0, 0);

    const pixelData = ctx.getImageData(0, 0, img.width, img.height);
    for (let i = 0; i < maskData.length; ++i) {
      pixelData.data[4 * i + 3] = maskData[i];
    }
    ctx.putImageData(pixelData, 0, 0);

    return canvas.toDataURL("image/png");
  };

  return { processImage, isLoading, error };
};