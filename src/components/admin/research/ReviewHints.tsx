import { detailValueKind } from '@/lib/detailValue';
import { readDetailScope } from '@/lib/detailScope';
import { dateInputValue } from '@/lib/settlementFormFields';
import {
  detailDateFromDraft,
  ResolvedProposalDraft,
} from '@/lib/research/proposalDraft';

type Baseline = {
  identity?: { city?: string; district?: string };
  records?: {
    description?: string;
    annotation?: string;
    detailDate?: string | null;
    published?: boolean;
  }[];
};

export function ReviewHints({
  kind,
  typeName,
  draft,
  baseline,
  evidence,
  savedDetailDate,
}: {
  kind: 'DETAIL' | 'RESOURCE';
  typeName: string;
  draft: ResolvedProposalDraft;
  baseline: unknown;
  evidence: string;
  savedDetailDate?: string;
}) {
  const previous = baseline as Baseline | null;
  const numeric = detailValueKind(typeName) !== 'text';
  const hints: string[] = [];
  if (kind === 'DETAIL') {
    const place = [previous?.identity?.city, previous?.identity?.district]
      .filter(Boolean)
      .join(' · ');
    hints.push(
      `Bezugsgebiet prüfen: Gehört die Angabe zur Siedlung und zu denselben Gebietsgrenzen, statt zum gesamten Stadtteil oder zur Stadt?${place ? ` Hinterlegter Ort: ${place}.` : ''}`,
    );
    if (numeric) {
      hints.push(
        'Zeitbezug prüfen: Der Stichtag muss zur Zahl gehören. Veröffentlichungs- und Abrufdatum der Quelle ersetzen keinen statistischen Zeitbezug. Historische Werte bleiben als Zeitreihe erhalten.',
      );
      hints.push(
        'Genauigkeit prüfen: „ca.“, Mindestwerte und Spannweiten in der Anmerkung erhalten. Eine Spannweite nicht ungeprüft auf eine einzelne Zahl reduzieren.',
      );
      hints.push(
        'Gesamtbestand als Regel: Teilbestände sind ausschließlich für klar abgegrenzte Bauabschnitte zulässig. Eigentümer-, Unternehmens- oder Förderbestände allein sind kein Bauabschnitt. Die Zuordnung im Formular am Quellenbeleg prüfen.',
      );
      if (detailValueKind(typeName) === 'integer')
        hints.push(
          'Bestandsart prüfen: Geplant, tatsächlich gebaut, bewohnt und nach Abriss noch vorhanden sind unterschiedliche Angaben. Den gemeinten Bestand in Name oder Anmerkung benennen.',
        );
      else
        hints.push(
          'Flächenbezug prüfen: Einheit umrechnen, falls nötig. Siedlungsfläche, Wohnfläche und Fläche des Stadtteils sind unterschiedliche Größen.',
        );
      const nextDate = savedDetailDate ?? detailDateFromDraft(draft);
      const records = (previous?.records ?? []).filter((record) => {
        if (record.published === false) return false;
        const previousScope = readDetailScope(record.annotation);
        const nextScope = readDetailScope(draft.annotation);
        return (
          previousScope.scope === 'UNKNOWN' ||
          nextScope.scope === 'UNKNOWN' ||
          (previousScope.scope === nextScope.scope &&
            previousScope.phase.trim().toLocaleLowerCase('de') ===
              nextScope.phase.trim().toLocaleLowerCase('de') &&
            previousScope.boundary.trim().toLocaleLowerCase('de') ===
              nextScope.boundary.trim().toLocaleLowerCase('de'))
        );
      });
      const sameYear = nextDate
        ? records.filter(
            (record) =>
              dateInputValue(record.detailDate)?.slice(0, 4) ===
              nextDate.slice(0, 4),
          )
        : [];
      const sameDay = sameYear.filter(
        (record) => dateInputValue(record.detailDate) === nextDate,
      );
      if (
        sameDay.some(
          (record) => Number(record.description) === Number(draft.value),
        )
      )
        hints.push(
          'Mögliche Dublette: Für denselben Stichtag existiert bereits derselbe Wert. Auch bei einer Jahresangabe kann der 31.12. nur die Archivkonvention sein. Vor einer zusätzlichen Übernahme vergleichen.',
        );
      if (
        sameDay.some(
          (record) => Number(record.description) !== Number(draft.value),
        )
      )
        hints.push(
          'Abweichender Wert zum selben Stichtag: Quellen, Gebietsgrenzen, Bestandsart und Genauigkeit vergleichen. Ein gleiches gespeichertes Datum kann auch aus einer reinen Jahresangabe stammen.',
        );
      if (sameYear.length > sameDay.length)
        hints.push(
          'Gleiches Bezugsjahr: Es gibt bereits Angaben aus diesem Jahr mit anderem Stichtag. Das ist nicht automatisch ein Widerspruch; die öffentliche Tabelle zeigt bisher nur das Jahr.',
        );
    }
    if (
      /Architekt|Planung|Bauherr|Bauphase|Fertigstellung|Bezugsfertig/i.test(
        `${typeName} ${draft.name} ${evidence}`,
      )
    )
      hints.push(
        'Beteiligung und Bauphase prüfen: Eine Rolle kann nur einen Abschnitt oder Vorentwurf betreffen. Planung, Baubeginn, Bezugsfertigkeit und Fertigstellung nicht gleichsetzen.',
      );
    hints.push(
      'Widersprüche prüfen: Stimmen Name, Wert, Anmerkung und Datum miteinander sowie mit dem Recherchebeleg überein? Die Hinweise ersetzen keine fachliche Quellenprüfung.',
    );
  } else if (/Foto|Bild/i.test(typeName)) {
    hints.push(
      'Bildressource prüfen: Die URL muss zum darstellbaren Bild führen. Herkunftsseite, Urheber und Lizenz sind getrennte Angaben; nur belegte Informationen übernehmen und unbekannte Angaben nicht erfinden.',
    );
  } else {
    hints.push(
      'Link prüfen: Führt die URL zu einer passenden Seite über diese Siedlung? Einen aussagekräftigen Namen vergeben und den Ressourcentyp prüfen.',
    );
    if (/^(website|webseite)\b/i.test(typeName))
      hints.push(
        'Bei Websites genügt die URL als Quelle. Eine zusätzliche Quellenangabe ist nicht erforderlich.',
      );
    else
      hints.push(
        'Ressourcentyp prüfen: Eine Webseite, ein PDF und ein Foto benötigen unterschiedliche Darstellungen. Lizenz und Copyright nur mit belegter Angabe ergänzen.',
      );
  }
  return (
    <aside
      aria-label='Fachliche Prüfpunkte'
      className='border border-text p-3 space-y-2'
    >
      <h4 className='font-semibold'>Fachliche Prüfpunkte</h4>
      <p className='text-sm'>
        Hinweise für dein Review. Sie blockieren die Freigabe nicht.
      </p>
      <ul className='list-disc pl-5 space-y-2 text-sm'>
        {hints.map((hint) => (
          <li key={hint}>{hint}</li>
        ))}
      </ul>
    </aside>
  );
}
