'use client';

import axios from 'axios';
import Image from 'next/image';
import { FormEvent, useState } from 'react';

import { Box, Container } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { Headline } from '@/components/Headline';
import Layout from '@/components/layout/Layout';

export default function File() {
  const [images, setImages] = useState<File[]>([]);
  const [displayedImages, setDisplayedImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const updateSelectedImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      //convert `FileList` to `File[]`
      const _files = Array.from(e.target.files);
      setImages(_files);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    images.forEach((image, i) => {
      formData.append(image.name, image);
    });
    setUploading(true);
    const response = await axios.post('/api/upload', formData);
    console.log(response);
    if (response.data.success) {
      setDisplayedImages(response.data.images);
    }
    setUploading(false);
  };


  return (
    <Layout>
      <section>
        <Container>
          <Box>
            <Headline type='h1'>File Upload</Headline>
            <form>
              <input type='file' multiple onChange={updateSelectedImages} />
              <Button disabled={uploading} type='button' onClick={handleSubmit}>Submit</Button>
            </form>
          </Box>
          <Box>
            {displayedImages.map((image, index) => (
              <Image key={index} src={image.url} alt="" width={image.width} height={image.height} />
            ))}
          </Box>
        </Container>
      </section>
    </Layout>
  );
}
