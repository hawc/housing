'use client';

import { useForm } from '@formspree/react';
import React from 'react';

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
        className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
        id="email"
        type="email"
        name="email"
      />
      {getFieldErrors('email')}
      <label htmlFor="name">
        Name
      </label>
      <InputGhost
        className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
        id="name"
        type="name"
        name="name"
      />
      {getFieldErrors('name')}
      <label htmlFor="message">
        Nachricht
      </label>
      <TextareaGhost
        className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
        id="message"
        name="message"
      />
      {getFieldErrors('message')}
      {getFormErrors()}
      <Button type="submit" disabled={state.submitting}>
        Absenden
      </Button>
    </form>
  );
}
