import { useForm, ValidationError } from '@formspree/react';
import React from 'react';

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
      <input
        id="email"
        type="email"
        name="email"
      />
      <ValidationError
        prefix="E-Mail"
        field="email"
        errors={state.errors}
      />
      <textarea
        id="message"
        name="message"
      />
      <ValidationError
        prefix="Nachricht"
        field="message"
        errors={state.errors}
      />
      <button type="submit" disabled={state.submitting}>
        Absenden
      </button>
    </form>
  );
}
