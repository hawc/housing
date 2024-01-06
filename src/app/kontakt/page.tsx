import { Metadata } from 'next';
import * as React from 'react';

import { Box } from '@/components/blocks/Box';
import { Breadcrumb, Breadcrumbs } from '@/components/blocks/breadcrumbs/Breadcrumbs';
import { ContactForm } from '@/components/ContactForm';
import { Headline } from '@/components/Headline';
import Layout from '@/components/layout/Layout';

export const metadata: Metadata = {
  title: 'Kontakt',
};

export default function Kontakt() {
  return (
    <Layout breadcrumbs={
      <Breadcrumbs>
        <Breadcrumb href="/">Startseite</Breadcrumb>
        <Breadcrumb>Kontakt</Breadcrumb>
      </Breadcrumbs>
    }>
      <section>
        <Box ghost>
          <div className='flex mt-6'>
            <Headline type='h1'>Kontakt</Headline>
          </div>
        </Box>
        <Box>
          <ContactForm />
        </Box>
      </section>
    </Layout>
  );
}
