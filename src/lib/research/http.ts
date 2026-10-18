import { NextResponse } from 'next/server';
import { adminSubject } from '../adminAuth';
import { isSameOrigin } from '../adminAccess';
import { object, ResearchError } from './validation';

export async function researchRequest(
  request: Request,
  action: (subject: string) => Promise<unknown>,
) {
  try {
    const subject = await adminSubject();
    if (!subject)
      throw new ResearchError('Keine Administratorberechtigung.', 403);
    if (request.method !== 'GET' && !isSameOrigin(request))
      throw new ResearchError('Ungültiger Anfrageursprung.', 403);
    return NextResponse.json(await action(subject), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    const status = error instanceof ResearchError ? error.status : 500;
    return NextResponse.json(
      {
        error:
          error instanceof ResearchError
            ? error.message
            : 'Recherche ist gerade nicht verfügbar. Bitte Datenbankmigration und Serverkonfiguration prüfen.',
      },
      { status, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

export async function requestBody(request: Request) {
  const text = await request.text();
  if (text.length > 16000) throw new ResearchError('Eingabe ist zu groß.', 413);
  try {
    return object(JSON.parse(text));
  } catch {
    throw new ResearchError('Ungültige JSON-Eingabe.');
  }
}
