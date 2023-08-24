'use client';

import axios from 'axios';
import { useState } from 'react';

import { Button } from '@/components/blocks/form/Button';

import { ImageResponse } from '@/app/api/upload/route';

interface UploadProps extends React.HTMLAttributes<HTMLElement> {
  setImages: (images: ImageResponse[]) => void;
  category: string;
  multiple?: boolean;
}

export default function Upload({ setImages, category, id, multiple = false, className = '', ...rest }: UploadProps) {
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const updateSelectedImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadImages(files);
    }
  };

  const handleSubmit = async () => {
    setUploading(true);

    const formData = new FormData();
    uploadImages.forEach((image) => {
      formData.append('image', image);
    });
    formData.append('category', category);
    const response = await axios.post('/api/upload', formData);
    if (response.data.success) {
      setImages(response.data.images);
    }
    setUploading(false);
  };

  return (
    <form className={`flex flex-row gap-4 ${className}`} {...rest}>
      <label className='flex-grow border-2 py-1 px-3 border-highlight' htmlFor={id}>
        {multiple ? 'Fotos auswählen' : 'Foto auswählen'} {uploadImages.length ? `(${uploadImages.length})` : ''}
      </label>
      <input
        id={id}
        title={multiple ? 'Fotos auswählen' : 'Foto auswählen'}
        disabled={uploading}
        type='file'
        accept='image/png, image/jpeg'
        multiple={multiple}
        hidden
        onChange={updateSelectedImages} />
      <Button disabled={uploading} type='button' onClick={handleSubmit}>Hochladen</Button>
    </form>
  );
}
