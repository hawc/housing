import { lookup } from 'node:dns/promises';
import { request } from 'node:https';
import { BlockList } from 'node:net';
import { canonicalUrl, normalizeText, ResearchError } from './validation';

const blocked = new BlockList();
for (const [network, prefix] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.0.2.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['198.51.100.0', 24],
  ['203.0.113.0', 24],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
] as const)
  blocked.addSubnet(network, prefix, 'ipv4');

export const isPublicIPv4 = (address: string) =>
  /^\d+\.\d+\.\d+\.\d+$/.test(address) && !blocked.check(address, 'ipv4');

function decodeEntities(text: string) {
  const entities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: String.fromCharCode(39),
    nbsp: ' ',
    auml: 'ä',
    ouml: 'ö',
    uuml: 'ü',
    Auml: 'Ä',
    Ouml: 'Ö',
    Uuml: 'Ü',
    szlig: 'ß',
    ndash: '–',
    mdash: '—',
  };
  return text.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
    (match, entity: string) => {
      if (entity[0] !== '#') return entities[entity] ?? match;
      const code =
        entity[1].toLowerCase() === 'x'
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ' ';
    },
  );
}

export function htmlToText(html: string) {
  return normalizeText(
    decodeEntities(
      html
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(
          /<(script|style|nav|footer|header)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
          ' ',
        )
        .replace(/<[^>]+>/g, ' '),
    ),
  );
}

export type RetrievedSource = {
  url: string;
  title: string;
  text: string;
  retrievedAt: Date;
};

// Resolve and pin a public IPv4 address for every request, including redirects.
// This avoids localhost/metadata access and DNS rebinding through discovered links.
export async function retrieveSource(
  input: string,
  redirects = 0,
): Promise<RetrievedSource> {
  const url = new URL(canonicalUrl(input));
  if (redirects > 3) throw new ResearchError('Zu viele Weiterleitungen.');
  const addresses = await lookup(url.hostname, { all: true, family: 4 });
  if (
    !addresses.length ||
    addresses.some(({ address }) => !isPublicIPv4(address))
  ) {
    throw new ResearchError('Quelle ist keine öffentliche Internetadresse.');
  }
  const response = await new Promise<{
    status: number;
    location?: string;
    type: string;
    body: string;
  }>((resolve, reject) => {
    const req = request(
      url,
      {
        family: 4,
        lookup: (_hostname, _options, callback) =>
          callback(null, addresses[0].address, 4),
        signal: AbortSignal.timeout(12000),
        headers: {
          'User-Agent':
            'GrosswohnsiedlungenResearch/1.0 (+https://grosswohnsiedlungen.de/kontakt)',
          Accept: 'text/html,text/plain',
          'Accept-Encoding': 'identity',
        },
      },
      (res) => {
        const status = res.statusCode ?? 500;
        const type = res.headers['content-type'] ?? '';
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          resolve({ status, location: res.headers.location, type, body: '' });
          return;
        }
        if (
          status !== 200 ||
          !/^(text\/html|text\/plain|application\/xhtml\+xml)\b/i.test(type)
        ) {
          res.resume();
          reject(
            new ResearchError(
              type.includes('pdf')
                ? 'PDF: automatische Textextraktion im ersten Ausbau noch nicht verfügbar.'
                : 'Quelle nicht als HTML/Text abrufbar.',
            ),
          );
          return;
        }
        if (
          res.headers['content-encoding'] &&
          res.headers['content-encoding'] !== 'identity'
        ) {
          res.destroy();
          reject(
            new ResearchError('Komprimierte Quelle wird nicht verarbeitet.'),
          );
          return;
        }
        const chunks: Buffer[] = [];
        let length = 0;
        res.on('data', (chunk: Buffer) => {
          length += chunk.length;
          if (length > 1_500_000) {
            res.destroy(
              new ResearchError('Quelle überschreitet das Größenlimit.'),
            );
          } else chunks.push(chunk);
        });
        res.on('error', reject);
        res.on('end', () =>
          resolve({
            status,
            type,
            body: Buffer.concat(chunks).toString(
              /charset=(iso-8859-1|windows-1252)/i.test(type)
                ? 'latin1'
                : 'utf8',
            ),
          }),
        );
      },
    );
    req.on('error', reject);
    req.end();
  });
  if (response.location)
    return retrieveSource(
      new URL(response.location, url).toString(),
      redirects + 1,
    );
  const title = htmlToText(
    response.body.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ??
      url.hostname,
  ).slice(0, 300);
  const text = (
    response.type.startsWith('text/plain')
      ? normalizeText(response.body)
      : htmlToText(response.body)
  ).slice(0, 45000);
  if (text.length < 100)
    throw new ResearchError('Quelle enthält zu wenig lesbaren Text.');
  return { url: url.toString(), title, text, retrievedAt: new Date() };
}
