import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { Modal } from './Modal';
import { Icon } from './Icon';

interface BarcodeScannerModalProps {
  onScanSuccess: (data: string) => void;
  onClose: () => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onScanSuccess, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsScanning(false);
  };

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          stopCamera();
          onScanSuccess(code.data);
        }
      }
    }
    if (isScanning) {
       animationFrameRef.current = requestAnimationFrame(tick);
    }
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        animationFrameRef.current = requestAnimationFrame(tick);
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Could not access camera. Please check permissions.");
        setIsScanning(false);
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={handleClose} title="Scan Barcode/QR Code">
      <div className="relative w-full aspect-square bg-gray-900 rounded-md overflow-hidden">
        <video ref={videoRef} playsInline autoPlay muted className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 border-8 border-white/20 rounded-md" />
      </div>
      <div className="text-center mt-4">
        {error && <p className="text-red-400">{error}</p>}
        {isScanning && <p className="text-gray-400">Position a QR code inside the frame.</p>}
        {!isScanning && !error && <p className="text-green-500">Scan complete!</p>}
      </div>
       <div className="flex justify-center mt-4">
        <button onClick={handleClose} title="Stop camera and close scanner" className="flex items-center py-2 px-6 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
            <Icon icon="stop-circle" className="w-5 h-5 mr-2" title="Stop & Close" />
            Stop & Close
        </button>
      </div>
    </Modal>
  );
};