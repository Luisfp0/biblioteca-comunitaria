"use client";

import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
}

export default function QRCodeGenerator({
  url,
  size = 200,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error("Erro ao gerar QR Code:", error);
        }
      );
    }
  }, [url, size]);

  const downloadQRCode = () => {
    setDownloading(true);
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "qrcode-livro.png";
      link.href = url;
      link.click();
    }
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas ref={canvasRef} className="border-2 border-gray-300 rounded-lg" />
      <button
        onClick={downloadQRCode}
        disabled={downloading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
      >
        {downloading ? "Baixando..." : "Baixar QR Code"}
      </button>
    </div>
  );
}
