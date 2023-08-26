'use client';

import { Loader2Icon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ImageResponse } from '@/app/api/upload/route';

interface UploadProps extends React.HTMLAttributes<HTMLElement> {
  onUpload: (images: ImageResponse[]) => void;
  category: string;
  multiple?: boolean;
}

function UploadInputLabel({ uploadImages }: { uploadImages: File[] }) {
  return (
    <>
      {uploadImages.length ? (
        <div className='block whitespace-nowrap text-ellipsis overflow-hidden'>
          {uploadImages.length === 1 ? (
            uploadImages[0].name
          ) : (
            `${uploadImages.length} Dateien`
          )}
        </div>
      ) : (
        <div className='flex justify-between '>
          <span>auswählen</span><span className='flex items-center'><PlusIcon /></span>
        </div>
      )}
    </>
  );
}

export default function Upload({ onUpload, category, id, multiple = false, className = '', ...rest }: UploadProps) {
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const uuid = uuidv4();

  const updateSelectedImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpload([]);
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadImages(files);
      handleSubmit(files);
    } else {
      setUploadImages([]);
    }
  };

  const handleSubmit = async (files) => {
    setUploading(true);

    const formData = new FormData();
    files.forEach((image) => {
      formData.append('image', image);
    });
    formData.append('category', category);
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const result = await response.json();

    if (result.success) {
      onUpload(result.images);
    }
    setUploading(false);
  };

  return (
    <form className={`flex flex-row ${className}`} {...rest}>
      <label className='flex-grow border-2 py-1 px-3 border-highlight max-w-full' htmlFor={`${id}-${uuid}`}>
        {uploading ? (
          <div className='flex justify-between'>
            <span>Lädt...</span><span className='flex items-center'><Loader2Icon className='animate-spin' /></span>
          </div>
        ) : (
          <UploadInputLabel uploadImages={uploadImages} />
        )}
      </label>
      <input
        id={`${id}-${uuid}`}
        title="auswählen"
        disabled={uploading}
        type='file'
        accept='image/png, image/jpeg'
        multiple={multiple}
        hidden
        onChange={updateSelectedImages} />
    </form>
  );
}
