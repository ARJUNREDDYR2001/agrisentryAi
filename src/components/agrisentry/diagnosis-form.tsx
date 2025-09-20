'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon } from 'lucide-react';

type DiagnosisFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
};

export default function DiagnosisForm({ onSubmit }: DiagnosisFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageFile) return;
    const formData = new FormData();
    formData.append('photo', imageFile);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center text-center">
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <div
        className="w-full h-64 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
        onClick={handleUploadClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) {
            handleFileChange({ target: { files: e.dataTransfer.files } } as any);
          }
        }}
      >
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Plant preview"
            width={256}
            height={256}
            className="object-contain h-full w-full p-2"
          />
        ) : (
          <div className="flex flex-col items-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-2" />
            <p>Click to upload or drag & drop an image</p>
            <p className="text-xs">PNG, JPG, or WEBP</p>
          </div>
        )}
      </div>

      <Button type="submit" disabled={!imageFile} className="w-full md:w-1/2 bg-primary text-primary-foreground hover:bg-primary/90">
        <Upload className="mr-2 h-4 w-4" />
        Diagnose Plant
      </Button>
    </form>
  );
}
