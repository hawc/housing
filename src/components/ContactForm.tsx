'use client';

import { useForm } from '@formspree/react';
import { InfoIcon } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';

const errorMessages = {
  INACTIVE: 'Das Formular ist zurzeit nicht verfügbar.',
  BLOCKED: 'Das Formular ist zurzeit nicht verfügbar.',
  EMPTY: 'Das Formular darf nicht leer sein.',
  PROJECT_NOT_FOUND: 'Das Formular ist zurzeit nicht verfügbar.',
  FORM_NOT_FOUND: 'Das Formular ist zurzeit nicht verfügbar.',
  NO_FILE_UPLOADS: 'Upload nicht verfügbar.',
  TOO_MANY_FILES: 'Zu viele Dateien.',
  FILES_TOO_BIG: 'Eine oder mehrere Dateien sind zu groß.',
  REQUIRED_FIELD_MISSING: 'Das Pflichtfeld darf nicht leer sein.',
  REQUIRED_FIELD_EMPTY: 'Das Pflichtfeld darf nicht leer sein.',
  TYPE_EMAIL: 'Das Feld enthält keine valide E-Mail-Adresse.',
  TYPE_NUMERIC: 'Das Feld enthält keine valide Zahl.',
  TYPE_TEXT: 'Das Feld enthält keinen validen Text.',
};

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [state, handleSubmit] = useForm('mwkgkydb', {
    data: {
      subject: 'Neue Kontaktanfrage auf grosswohnsiedlungen.de',
      pageTitle: function () {
        return document.title;
      }
    }
  });

  function getFieldErrors(fieldName: string) {
    const fieldErrors = state.errors?.getFieldErrors(fieldName);

    if (!fieldErrors) {
      return;
    }

    return fieldErrors.map((error, index) => (
      <p key={index}>{errorMessages[error.code] ?? 'Unbekannter Fehler.'}</p>
    ));
  }

  function getFormErrors() {
    const fieldErrors = state.errors?.getFormErrors();

    if (!fieldErrors) {
      return;
    }

    return fieldErrors.map((error, index) => (
      <p key={index}>{errorMessages[error.code] ?? 'Unbekannter Fehler.'}</p>
    ));
  }

  if (state.succeeded) {
    return <p>Danke für Ihre Nachricht!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">
        E-Mail-Adresse
      </label>
      <InputGhost
        className='mt-1 border-white border-solid border-2 mb-2 p-1'
        id="email"
        type="email"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      {getFieldErrors('email')}
      <label htmlFor="name">
        Name
      </label>
      <InputGhost
        className='mt-1 border-white border-solid border-2 mb-2 p-1'
        id="name"
        type="name"
        name="name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      {getFieldErrors('name')}
      <label htmlFor="message">
        Nachricht
      </label>
      <TextareaGhost
        className='mt-1 border-white border-solid border-2 mb-2 p-1'
        id="message"
        name="message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      {getFieldErrors('message')}
      {getFormErrors()}
      <Button type="submit" className='w-full md:w-auto' disabled={state.submitting || !name || !email || !message}>
        Absenden
      </Button>
      {(!name || !email || !message) && (
        <span className='pt-2 md:pt-0 md:pl-4 block md:inline'><InfoIcon size={22} className='inline mr-2' />Bitte füllen Sie alle Felder aus.</span>
      )}
    </form>
  );
}
