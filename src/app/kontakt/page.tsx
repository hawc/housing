import { Metadata } from 'next';
import { Suspense } from 'react';

import { Box } from '@/components/blocks/Box';
import { Breadcrumb, Breadcrumbs } from '@/components/blocks/breadcrumbs/Breadcrumbs';
import { ContactForm } from '@/components/ContactForm';
import { Headline } from '@/components/Headline';
import Layout from '@/components/layout/Layout';

export async function generateMetadata(
  { searchParams }
): Promise<Metadata> {
  return {
    title: 'Kontakt',
    alternates: searchParams.from ? { canonical: `${process.env.BASE_URL}/kontakt` } : undefined
  };
}


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
          <p>
            Wir schätzen dein Feedback sehr und freuen uns über alle Fragen oder Hinweise. Wir versuchen deine Nachricht schnellstmöglich zu beantworten.
          </p>
        </Box>
        <Box>
          <Suspense>
            <ContactForm />
          </Suspense>
        </Box>
      </section>
    </Layout>
  );
}
