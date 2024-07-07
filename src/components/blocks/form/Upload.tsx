'use client';

import { Loader2Icon, PlusIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { fetchData } from '@/lib/fetch';

import type { ImageResponse } from '@/app/api/upload/route';

interface UploadResponse {
  success: boolean;
  images: ImageResponse[];
}

interface UploadProps extends React.HTMLAttributes<HTMLElement> {
  onUpload: (images: ImageResponse[]) => void;
  category: string;
  multiple?: boolean;
}

function UploadInputLabel({ uploadImages }: { uploadImages: File[] }) {
  return uploadImages.length ? (
    <div className='block whitespace-nowrap text-ellipsis overflow-hidden'>
      {uploadImages.length === 1 ? uploadImages[0].name : `${uploadImages.length} Dateien`}
    </div>
  ) : (
    <div className='flex justify-between'>
      <span>auswählen</span><span className='flex items-center'><PlusIcon /></span>
    </div>
  );
}

export default function Upload({ onUpload, category, id, multiple = false, className = '', ...rest }: UploadProps) {
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function updateSelectedImages(event: React.ChangeEvent<HTMLInputElement>) {
    onUpload([]);
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setUploadImages(files);
      handleSubmit(files);
    } else {
      setUploadImages([]);
    }
  }

  async function handleSubmit(files: File[]) {
    setUploading(true);

    const formData = new FormData();
    files.forEach((image: File) => {
      formData.append('image', image);
    });
    formData.append('category', category);
    const result = await fetchData<UploadResponse, UploadResponse>('/api/upload', { success: false, images: [] }, { method: 'POST', body: formData });

    if (result.success) {
      onUpload(result.images);
    }
    setUploading(false);
  }

  return (
    <div onClick={() => input.current?.click()} className={`flex flex-row cursor-default ${className}`} {...rest}>
      <div className='flex-grow border-2 py-1 px-3 border-highlight max-w-full'>
        {uploading ? (
          <div className='flex justify-between'>
            <span>Lädt...</span><span className='flex items-center'><Loader2Icon className='animate-spin' /></span>
          </div>
        ) : (
          <UploadInputLabel uploadImages={uploadImages} />
        )}
      </div>
      <input
        ref={input}
        id={id}
        title='auswählen'
        disabled={uploading}
        type='file'
        accept='image/png, image/jpeg'
        multiple={multiple}
        hidden
        onChange={updateSelectedImages} />
    </div>
  );
}
