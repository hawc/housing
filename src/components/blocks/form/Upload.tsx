'use client';

import axios from 'axios';
import { FormEvent, useState } from 'react';

import { Button } from '@/components/blocks/form/Button';

export default function Upload({ setImages }) {
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const updateSelectedImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const _files = Array.from(e.target.files);
      setUploadImages(_files);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    uploadImages.forEach((image) => {
      formData.append(image.name, image);
    });
    setUploading(true);
    const response = await axios.post('/api/upload', formData);
    if (response.data.success) {
      setImages(response.data.images);
    }
    setUploading(false);
  };

  return (
    <form>
      <input type='file' multiple onChange={updateSelectedImages} />
      <Button disabled={uploading} type='button' onClick={handleSubmit}>Hochladen</Button>
    </form>
  );
}
