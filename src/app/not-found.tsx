
import { Box, Container } from '@/components/blocks/Box';
import { Link } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';
import { Headline } from '@/components/Headline';
import Layout from '@/components/layout/Layout';

export default function NotFound() {
  return (
    <Layout>
      <main>
        <section>
          <Container>
            <Box>
              <Headline type='h1'>Seite nicht gefunden</Headline>
              <p>Die von dir angeforderte Seite konnte leider nicht gefunden werden. Es tut uns leid für das Missgeschick.</p>
              <p>Vielleicht hast du eine falsche URL eingegeben oder die Seite wurde möglicherweise verschoben, umbenannt oder gelöscht. Keine Sorge, wir helfen dir gerne weiter.</p>
              <p>Hier sind ein paar Schritte, die du ausprobieren kannst, um das Problem zu beheben:</p>
              <List numbered className="my-5">
                <ListItem><strong>Überprüfe die URL:</strong> Stell sicher, dass du die richtige Adresse eingegeben hast. Manchmal passieren uns Tippfehler oder Buchstabendreher, die dazu führen können, dass die Seite nicht gefunden wird.</ListItem>
                <ListItem><strong>Starte die Suche erneut:</strong> Gehe zurück zur vorherigen Seite und versuche es noch einmal. Möglicherweise hilft eine erneute Suche oder Navigation, die gewünschten Informationen zu finden.</ListItem>
                <ListItem><strong>Kontaktiere uns:</strong> Wenn du glaubst, dass es ein Fehler unsererseits ist oder wenn du Hilfe benötigst, zögere nicht, uns zu kontaktieren. Wir stehen dir zur Verfügung, um das Problem zu lösen und dir weiterzuhelfen.</ListItem>
              </List>
              <p>Wir entschuldigen uns erneut für die Unannehmlichkeiten. Wir möchten sicherstellen, dass du das findest, wonach du suchst. Viel Erfolg bei der weiteren Navigation!</p>
              <div>
                <Link arrow back className='mt-3' href='/'>Zurück zur Startseite</Link>
              </div>
            </Box>
          </Container>
        </section>
      </main>
    </Layout>
  )
}