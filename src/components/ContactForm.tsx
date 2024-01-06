'use client';

import { useForm, ValidationError } from '@formspree/react';
import React from 'react';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';

export function ContactForm() {
  const [state, handleSubmit] = useForm('mwkgkydb');

  if (state.succeeded) {
    return <p>Danke für Ihre Nachricht!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">
        E-Mail-Adresse
      </label>
      <InputGhost
        className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
        id="email"
        type="email"
        name="email"
      />
      <ValidationError
        prefix="E-Mail"
        field="email"
        errors={state.errors}
      />
      <label htmlFor="message">
        Nachricht
      </label>
      <TextareaGhost
        className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
        id="message"
        name="message"
      />
      <ValidationError
        prefix="Nachricht"
        field="message"
        errors={state.errors}
      />
      <Button type="submit" disabled={state.submitting}>
        Absenden
      </Button>
    </form>
  );
}
