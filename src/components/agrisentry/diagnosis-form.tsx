'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, Camera, ImageIcon, RefreshCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type DiagnosisFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
};

export default function DiagnosisForm({ onSubmit }: DiagnosisFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (showCamera) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      };

      getCameraPermission();
      
      return () => {
        // Stop camera stream when component unmounts or camera is hidden
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  }, [showCamera, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
          setImageFile(file);
          setImagePreview(canvas.toDataURL('image/jpeg'));
          setShowCamera(false); // Hide camera view after capture
        }
      }, 'image/jpeg');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageFile) return;
    const formData = new FormData();
    formData.append('photo', imageFile);
    onSubmit(formData);
  };
  
  const resetSelection = () => {
      setImageFile(null);
      setImagePreview(null);
      setShowCamera(false);
  }

  if (showCamera) {
    return (
      <div className="space-y-4 flex flex-col items-center text-center">
        <canvas ref={canvasRef} className="hidden"></canvas>
        <div className="w-full h-64 border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        </div>
        {hasCameraPermission === false && (
            <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                Please allow camera access in your browser settings to use this feature.
                </AlertDescription>
            </Alert>
        )}
        <div className="w-full flex justify-center gap-4">
            <Button onClick={handleCapture} disabled={hasCameraPermission !== true} className="w-full md:w-1/2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Camera className="mr-2" /> Capture
            </Button>
            <Button variant="outline" onClick={() => setShowCamera(false)} className="w-full md:w-1/2">
                Cancel
            </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {imagePreview ? (
        <div className="w-full h-64 border-2 border-dashed border-primary rounded-lg flex items-center justify-center relative p-2">
            <Image
                src={imagePreview}
                alt="Plant preview"
                fill
                className="object-contain"
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={resetSelection}
              className="absolute -top-3 -right-3 rounded-full z-10"
              aria-label="Remove image"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
        </div>
      ) : (
         <div className="w-full h-64 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-4 p-4">
             <Button type="button" variant="outline" className="w-full md:w-3/4" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="mr-2" /> Upload from Gallery
             </Button>
             <div className="flex items-center w-full md:w-3/4">
                <div className="flex-grow border-t border-muted-foreground/50"></div>
                <span className="flex-shrink mx-2 text-muted-foreground text-xs">OR</span>
                <div className="flex-grow border-t border-muted-foreground/50"></div>
            </div>
             <Button type="button" className="w-full md:w-3/4" onClick={() => setShowCamera(true)}>
                <Camera className="mr-2" /> Use Live Camera
             </Button>
         </div>
      )}

      <Button type="submit" disabled={!imageFile} className="w-full md:w-1/2 bg-primary text-primary-foreground hover:bg-primary/90">
        <Upload className="mr-2 h-4 w-4" />
        Diagnose Plant
      </Button>
    </form>
  );
}
