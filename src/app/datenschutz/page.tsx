import type { Metadata } from 'next';

import { Box } from '@/components/common/Box';
import {
  Breadcrumb,
  Breadcrumbs,
} from '@/components/common/breadcrumbs/Breadcrumbs';
import { Headline } from '@/components/Headline';
import { Layout } from '@/components/layout/Layout';
import { AtSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
};

export default function Datenschutzerklärung() {
  return (
    <Layout
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumb href='/'>Startseite</Breadcrumb>
          <Breadcrumb>Datenschutzerklärung</Breadcrumb>
        </Breadcrumbs>
      }
    >
      <section>
        <Box ghost>
          <div className='flex mt-6'>
            <Headline type='h1'>Datenschutzerklärung</Headline>
          </div>
        </Box>
        <Box>
          <div>
            <Headline type='h2'>1. Datenschutz auf einen Blick</Headline>
            <Headline className='mt-4' type='h3'>
              Allgemeine Hinweise
            </Headline>
            <p>
              Die folgenden Hinweise geben einen einfachen &Uuml;berblick
              dar&uuml;ber, was mit Ihren personenbezogenen Daten passiert, wenn
              Sie diese Website besuchen. Personenbezogene Daten sind alle
              Daten, mit denen Sie pers&ouml;nlich identifiziert werden
              k&ouml;nnen. Ausf&uuml;hrliche Informationen zum Thema Datenschutz
              entnehmen Sie unserer unter diesem Text aufgef&uuml;hrten
              Datenschutzerkl&auml;rung.
            </p>
            <Headline className='mt-4' type='h3'>
              Datenerfassung auf dieser Website
            </Headline>
            <h4>
              Wer ist verantwortlich f&uuml;r die Datenerfassung auf dieser
              Website?
            </h4>{' '}
            <p>
              Die Datenverarbeitung auf dieser Website erfolgt durch den
              Websitebetreiber. Dessen Kontaktdaten k&ouml;nnen Sie dem
              Abschnitt &bdquo;Hinweis zur Verantwortlichen Stelle&ldquo; in
              dieser Datenschutzerkl&auml;rung entnehmen.
            </p>{' '}
            <h4>Wie erfassen wir Ihre Daten?</h4>{' '}
            <p>
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
              mitteilen. Hierbei kann es sich z.&nbsp;B. um Daten handeln, die
              Sie in ein Kontaktformular eingeben.
            </p>{' '}
            <p>
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim
              Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor
              allem technische Daten (z.&nbsp;B. Internetbrowser, Betriebssystem
              oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten
              erfolgt automatisch, sobald Sie diese Website betreten.
            </p>{' '}
            <h4>Wof&uuml;r nutzen wir Ihre Daten?</h4>{' '}
            <p>
              Ein Teil der Daten wird erhoben, um eine fehlerfreie
              Bereitstellung der Website zu gew&auml;hrleisten. Andere Daten
              k&ouml;nnen zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>{' '}
            <h4>Welche Rechte haben Sie bez&uuml;glich Ihrer Daten?</h4>{' '}
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft &uuml;ber
              Herkunft, Empf&auml;nger und Zweck Ihrer gespeicherten
              personenbezogenen Daten zu erhalten. Sie haben au&szlig;erdem ein
              Recht, die Berichtigung oder L&ouml;schung dieser Daten zu
              verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung
              erteilt haben, k&ouml;nnen Sie diese Einwilligung jederzeit
              f&uuml;r die Zukunft widerrufen. Au&szlig;erdem haben Sie das
              Recht, unter bestimmten Umst&auml;nden die Einschr&auml;nkung der
              Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des
              Weiteren steht Ihnen ein Beschwerderecht bei der zust&auml;ndigen
              Aufsichtsbeh&ouml;rde zu.
            </p>{' '}
            <p>
              Hierzu sowie zu weiteren Fragen zum Thema Datenschutz k&ouml;nnen
              Sie sich jederzeit an uns wenden.
            </p>
            <Headline className='mt-4' type='h3'>
              Analyse-Tools und Tools von Dritt&shy;anbietern
            </Headline>
            <p>
              Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch
              ausgewertet werden. Das geschieht vor allem mit sogenannten
              Analyseprogrammen.
            </p>{' '}
            <p>
              Detaillierte Informationen zu diesen Analyseprogrammen finden Sie
              in der folgenden Datenschutzerkl&auml;rung.
            </p>
            <Headline className='mt-4' type='h2'>
              2. Hosting
            </Headline>
            <p>
              Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
              Vercel Inc.
            </p>
            <Headline className='mt-4' type='h3'>
              Externes Hosting
            </Headline>
            <p>
              Diese Website wird extern gehostet. Die personenbezogenen Daten,
              die auf dieser Website erfasst werden, werden auf den Servern des
              Hosters / der Hoster gespeichert. Hierbei kann es sich v.&nbsp;a.
              um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten,
              Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige
              Daten, die &uuml;ber eine Website generiert werden, handeln.
            </p>{' '}
            <p>
              Das externe Hosting erfolgt zum Zwecke der Vertragserf&uuml;llung
              gegen&uuml;ber unseren potenziellen und bestehenden Kunden (Art. 6
              Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen
              und effizienten Bereitstellung unseres Online-Angebots durch einen
              professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO). Sofern eine
              entsprechende Einwilligung abgefragt wurde, erfolgt die
              Verarbeitung ausschlie&szlig;lich auf Grundlage von Art. 6 Abs. 1
              lit. a DSGVO und &sect; 25 Abs. 1 TTDSG, soweit die Einwilligung
              die Speicherung von Cookies oder den Zugriff auf Informationen im
              Endger&auml;t des Nutzers (z.&nbsp;B. Device-Fingerprinting) im
              Sinne des TTDSG umfasst. Die Einwilligung ist jederzeit
              widerrufbar.
            </p>{' '}
            <p>
              Unser(e) Hoster wird bzw. werden Ihre Daten nur insoweit
              verarbeiten, wie dies zur Erf&uuml;llung seiner Leistungspflichten
              erforderlich ist und unsere Weisungen in Bezug auf diese Daten
              befolgen.
            </p>{' '}
            <p>Wir setzen folgende(n) Hoster ein:</p>
            <p>
              Vercel Inc.
              <br />
              440 N Barranca Ave #4133
              <br />
              Covina, CA 91723
              <br />
              United States
            </p>
            <Headline className='mt-4' type='h2'>
              3. Allgemeine Hinweise und Pflicht&shy;informationen
            </Headline>
            <Headline className='mt-4' type='h3'>
              Datenschutz
            </Headline>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer
              pers&ouml;nlichen Daten sehr ernst. Wir behandeln Ihre
              personenbezogenen Daten vertraulich und entsprechend den
              gesetzlichen Datenschutzvorschriften sowie dieser
              Datenschutzerkl&auml;rung.
            </p>{' '}
            <p>
              Wenn Sie diese Website benutzen, werden verschiedene
              personenbezogene Daten erhoben. Personenbezogene Daten sind Daten,
              mit denen Sie pers&ouml;nlich identifiziert werden k&ouml;nnen.
              Die vorliegende Datenschutzerkl&auml;rung erl&auml;utert, welche
              Daten wir erheben und wof&uuml;r wir sie nutzen. Sie
              erl&auml;utert auch, wie und zu welchem Zweck das geschieht.
            </p>{' '}
            <p>
              Wir weisen darauf hin, dass die Daten&uuml;bertragung im Internet
              (z.&nbsp;B. bei der Kommunikation per E-Mail)
              Sicherheitsl&uuml;cken aufweisen kann. Ein l&uuml;ckenloser Schutz
              der Daten vor dem Zugriff durch Dritte ist nicht m&ouml;glich.
            </p>
            <Headline className='mt-4' type='h3'>
              Hinweis zur verantwortlichen Stelle
            </Headline>
            <p>
              Die verantwortliche Stelle f&uuml;r die Datenverarbeitung auf
              dieser Website ist:
            </p>
            <p>
              Hendrik Wichern
            </p>
            <p>
              E-Mail:&nbsp;
            <span>
              web
              <AtSign className='inline' size={20} />
              hendrikwichern.de
            </span>
            </p>
            <p>
              Verantwortliche Stelle ist die nat&uuml;rliche oder juristische
              Person, die allein oder gemeinsam mit anderen &uuml;ber die Zwecke
              und Mittel der Verarbeitung von personenbezogenen Daten
              (z.&nbsp;B. Namen, E-Mail-Adressen o. &Auml;.) entscheidet.
            </p>
            <Headline className='mt-4' type='h3'>
              Speicherdauer
            </Headline>
            <p>
              Soweit innerhalb dieser Datenschutzerkl&auml;rung keine
              speziellere Speicherdauer genannt wurde, verbleiben Ihre
              personenbezogenen Daten bei uns, bis der Zweck f&uuml;r die
              Datenverarbeitung entf&auml;llt. Wenn Sie ein berechtigtes
              L&ouml;schersuchen geltend machen oder eine Einwilligung zur
              Datenverarbeitung widerrufen, werden Ihre Daten gel&ouml;scht,
              sofern wir keine anderen rechtlich zul&auml;ssigen Gr&uuml;nde
              f&uuml;r die Speicherung Ihrer personenbezogenen Daten haben
              (z.&nbsp;B. steuer- oder handelsrechtliche Aufbewahrungsfristen);
              im letztgenannten Fall erfolgt die L&ouml;schung nach Fortfall
              dieser Gr&uuml;nde.
            </p>
            <Headline className='mt-4' type='h3'>
              Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung
              auf dieser Website
            </Headline>
            <p>
              Sofern Sie in die Datenverarbeitung eingewilligt haben,
              verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von
              Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO, sofern
              besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO verarbeitet
              werden. Im Falle einer ausdr&uuml;cklichen Einwilligung in die
              &Uuml;bertragung personenbezogener Daten in Drittstaaten erfolgt
              die Datenverarbeitung au&szlig;erdem auf Grundlage von Art. 49
              Abs. 1 lit. a DSGVO. Sofern Sie in die Speicherung von Cookies
              oder in den Zugriff auf Informationen in Ihr Endger&auml;t
              (z.&nbsp;B. via Device-Fingerprinting) eingewilligt haben, erfolgt
              die Datenverarbeitung zus&auml;tzlich auf Grundlage von &sect; 25
              Abs. 1 TTDSG. Die Einwilligung ist jederzeit widerrufbar. Sind
              Ihre Daten zur Vertragserf&uuml;llung oder zur Durchf&uuml;hrung
              vorvertraglicher Ma&szlig;nahmen erforderlich, verarbeiten wir
              Ihre Daten auf Grundlage des Art. 6 Abs. 1 lit. b DSGVO. Des
              Weiteren verarbeiten wir Ihre Daten, sofern diese zur
              Erf&uuml;llung einer rechtlichen Verpflichtung erforderlich sind
              auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO. Die
              Datenverarbeitung kann ferner auf Grundlage unseres berechtigten
              Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen. &Uuml;ber die
              jeweils im Einzelfall einschl&auml;gigen Rechtsgrundlagen wird in
              den folgenden Abs&auml;tzen dieser Datenschutzerkl&auml;rung
              informiert.
            </p>
            <Headline className='mt-4' type='h3'>
              Empfänger von personenbezogenen Daten
            </Headline>
            <p>
              Im Rahmen unserer Gesch&auml;ftst&auml;tigkeit arbeiten wir mit
              verschiedenen externen Stellen zusammen. Dabei ist teilweise auch
              eine &Uuml;bermittlung von personenbezogenen Daten an diese
              externen Stellen erforderlich. Wir geben personenbezogene Daten
              nur dann an externe Stellen weiter, wenn dies im Rahmen einer
              Vertragserf&uuml;llung erforderlich ist, wenn wir gesetzlich
              hierzu verpflichtet sind (z.&nbsp;B. Weitergabe von Daten an
              Steuerbeh&ouml;rden), wenn wir ein berechtigtes Interesse nach
              Art. 6 Abs. 1 lit. f DSGVO an der Weitergabe haben oder wenn eine
              sonstige Rechtsgrundlage die Datenweitergabe erlaubt. Beim Einsatz
              von Auftragsverarbeitern geben wir personenbezogene Daten unserer
              Kunden nur auf Grundlage eines g&uuml;ltigen Vertrags &uuml;ber
              Auftragsverarbeitung weiter. Im Falle einer gemeinsamen
              Verarbeitung wird ein Vertrag &uuml;ber gemeinsame Verarbeitung
              geschlossen.
            </p>
            <Headline className='mt-4' type='h3'>
              Widerruf Ihrer Einwilligung zur Datenverarbeitung
            </Headline>
            <p>
              Viele Datenverarbeitungsvorg&auml;nge sind nur mit Ihrer
              ausdr&uuml;cklichen Einwilligung m&ouml;glich. Sie k&ouml;nnen
              eine bereits erteilte Einwilligung jederzeit widerrufen. Die
              Rechtm&auml;&szlig;igkeit der bis zum Widerruf erfolgten
              Datenverarbeitung bleibt vom Widerruf unber&uuml;hrt.
            </p>
            <Headline className='mt-4' type='h3'>
              Widerspruchsrecht gegen die Datenerhebung in besonderen
              F&auml;llen sowie gegen Direktwerbung (Art. 21 DSGVO)
            </Headline>
            <p>
              WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E
              ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS
              GR&Uuml;NDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN,
              GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH
              EINZULEGEN; DIES GILT AUCH F&Uuml;R EIN AUF DIESE BESTIMMUNGEN
              GEST&Uuml;TZTES PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF
              DENEN EINE VERARBEITUNG BERUHT, ENTNEHMEN SIE DIESER
              DATENSCHUTZERKL&Auml;RUNG. WENN SIE WIDERSPRUCH EINLEGEN, WERDEN
              WIR IHRE BETROFFENEN PERSONENBEZOGENEN DATEN NICHT MEHR
              VERARBEITEN, ES SEI DENN, WIR K&Ouml;NNEN ZWINGENDE
              SCHUTZW&Uuml;RDIGE GR&Uuml;NDE F&Uuml;R DIE VERARBEITUNG
              NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND FREIHEITEN
              &Uuml;BERWIEGEN ODER DIE VERARBEITUNG DIENT DER GELTENDMACHUNG,
              AUS&Uuml;BUNG ODER VERTEIDIGUNG VON RECHTSANSPR&Uuml;CHEN
              (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO).
            </p>{' '}
            <p>
              WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG
              ZU BETREIBEN, SO HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN
              DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM
              ZWECKE DERARTIGER WERBUNG EINZULEGEN; DIES GILT AUCH F&Uuml;R DAS
              PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG
              STEHT. WENN SIE WIDERSPRECHEN, WERDEN IHRE PERSONENBEZOGENEN DATEN
              ANSCHLIESSEND NICHT MEHR ZUM ZWECKE DER DIREKTWERBUNG VERWENDET
              (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).
            </p>
            <Headline className='mt-4' type='h3'>
              Beschwerde&shy;recht bei der zust&auml;ndigen
              Aufsichts&shy;beh&ouml;rde
            </Headline>
            <p>
              Im Falle von Verst&ouml;&szlig;en gegen die DSGVO steht den
              Betroffenen ein Beschwerderecht bei einer Aufsichtsbeh&ouml;rde,
              insbesondere in dem Mitgliedstaat ihres gew&ouml;hnlichen
              Aufenthalts, ihres Arbeitsplatzes oder des Orts des
              mutma&szlig;lichen Versto&szlig;es zu. Das Beschwerderecht besteht
              unbeschadet anderweitiger verwaltungsrechtlicher oder
              gerichtlicher Rechtsbehelfe.
            </p>
            <Headline className='mt-4' type='h3'>
              Recht auf Daten&shy;&uuml;bertrag&shy;barkeit
            </Headline>
            <p>
              Sie haben das Recht, Daten, die wir auf Grundlage Ihrer
              Einwilligung oder in Erf&uuml;llung eines Vertrags automatisiert
              verarbeiten, an sich oder an einen Dritten in einem g&auml;ngigen,
              maschinenlesbaren Format aush&auml;ndigen zu lassen. Sofern Sie
              die direkte &Uuml;bertragung der Daten an einen anderen
              Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch
              machbar ist.
            </p>
            <Headline className='mt-4' type='h3'>
              Auskunft, Berichtigung und L&ouml;schung
            </Headline>
            <p>
              Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen
              jederzeit das Recht auf unentgeltliche Auskunft &uuml;ber Ihre
              gespeicherten personenbezogenen Daten, deren Herkunft und
              Empf&auml;nger und den Zweck der Datenverarbeitung und ggf. ein
              Recht auf Berichtigung oder L&ouml;schung dieser Daten. Hierzu
              sowie zu weiteren Fragen zum Thema personenbezogene Daten
              k&ouml;nnen Sie sich jederzeit an uns wenden.
            </p>
            <Headline className='mt-4' type='h3'>
              Recht auf Einschr&auml;nkung der Verarbeitung
            </Headline>
            <p>
              Sie haben das Recht, die Einschr&auml;nkung der Verarbeitung Ihrer
              personenbezogenen Daten zu verlangen. Hierzu k&ouml;nnen Sie sich
              jederzeit an uns wenden. Das Recht auf Einschr&auml;nkung der
              Verarbeitung besteht in folgenden F&auml;llen:
            </p>{' '}
            <ul>
              {' '}
              <li>
                Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten
                personenbezogenen Daten bestreiten, ben&ouml;tigen wir in der
                Regel Zeit, um dies zu &uuml;berpr&uuml;fen. F&uuml;r die Dauer
                der Pr&uuml;fung haben Sie das Recht, die Einschr&auml;nkung der
                Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
              </li>{' '}
              <li>
                Wenn die Verarbeitung Ihrer personenbezogenen Daten
                unrechtm&auml;&szlig;ig geschah/geschieht, k&ouml;nnen Sie statt
                der L&ouml;schung die Einschr&auml;nkung der Datenverarbeitung
                verlangen.
              </li>{' '}
              <li>
                Wenn wir Ihre personenbezogenen Daten nicht mehr ben&ouml;tigen,
                Sie sie jedoch zur Aus&uuml;bung, Verteidigung oder
                Geltendmachung von Rechtsanspr&uuml;chen ben&ouml;tigen, haben
                Sie das Recht, statt der L&ouml;schung die Einschr&auml;nkung
                der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
              </li>{' '}
              <li>
                Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt
                haben, muss eine Abw&auml;gung zwischen Ihren und unseren
                Interessen vorgenommen werden. Solange noch nicht feststeht,
                wessen Interessen &uuml;berwiegen, haben Sie das Recht, die
                Einschr&auml;nkung der Verarbeitung Ihrer personenbezogenen
                Daten zu verlangen.
              </li>{' '}
            </ul>{' '}
            <p>
              Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten
              eingeschr&auml;nkt haben, d&uuml;rfen diese Daten &ndash; von
              ihrer Speicherung abgesehen &ndash; nur mit Ihrer Einwilligung
              oder zur Geltendmachung, Aus&uuml;bung oder Verteidigung von
              Rechtsanspr&uuml;chen oder zum Schutz der Rechte einer anderen
              nat&uuml;rlichen oder juristischen Person oder aus Gr&uuml;nden
              eines wichtigen &ouml;ffentlichen Interesses der Europ&auml;ischen
              Union oder eines Mitgliedstaats verarbeitet werden.
            </p>
            <Headline className='mt-4' type='h3'>
              SSL- bzw. TLS-Verschl&uuml;sselung
            </Headline>
            <p>
              Diese Seite nutzt aus Sicherheitsgr&uuml;nden und zum Schutz der
              &Uuml;bertragung vertraulicher Inhalte, wie zum Beispiel
              Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber
              senden, eine SSL- bzw. TLS-Verschl&uuml;sselung. Eine
              verschl&uuml;sselte Verbindung erkennen Sie daran, dass die
              Adresszeile des Browsers von &bdquo;http://&ldquo; auf
              &bdquo;https://&ldquo; wechselt und an dem Schloss-Symbol in Ihrer
              Browserzeile.
            </p>{' '}
            <p>
              Wenn die SSL- bzw. TLS-Verschl&uuml;sselung aktiviert ist,
              k&ouml;nnen die Daten, die Sie an uns &uuml;bermitteln, nicht von
              Dritten mitgelesen werden.
            </p>
            <Headline className='mt-4' type='h2'>
              4. Datenerfassung auf dieser Website
            </Headline>
            <Headline className='mt-4' type='h3'>
              Cookies
            </Headline>
            <p>
              Unsere Internetseiten verwenden so genannte &bdquo;Cookies&ldquo;.
              Cookies sind kleine Datenpakete und richten auf Ihrem
              Endger&auml;t keinen Schaden an. Sie werden entweder
              vor&uuml;bergehend f&uuml;r die Dauer einer Sitzung
              (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem
              Endger&auml;t gespeichert. Session-Cookies werden nach Ende Ihres
              Besuchs automatisch gel&ouml;scht. Permanente Cookies bleiben auf
              Ihrem Endger&auml;t gespeichert, bis Sie diese selbst l&ouml;schen
              oder eine automatische L&ouml;schung durch Ihren Webbrowser
              erfolgt.
            </p>{' '}
            <p>
              Cookies k&ouml;nnen von uns (First-Party-Cookies) oder von
              Drittunternehmen stammen (sog. Third-Party-Cookies).
              Third-Party-Cookies erm&ouml;glichen die Einbindung bestimmter
              Dienstleistungen von Drittunternehmen innerhalb von Webseiten
              (z.&nbsp;B. Cookies zur Abwicklung von Zahlungsdienstleistungen).
            </p>{' '}
            <p>
              Cookies haben verschiedene Funktionen. Zahlreiche Cookies sind
              technisch notwendig, da bestimmte Webseitenfunktionen ohne diese
              nicht funktionieren w&uuml;rden (z.&nbsp;B. die Warenkorbfunktion
              oder die Anzeige von Videos). Andere Cookies k&ouml;nnen zur
              Auswertung des Nutzerverhaltens oder zu Werbezwecken verwendet
              werden.
            </p>{' '}
            <p>
              Cookies, die zur Durchf&uuml;hrung des elektronischen
              Kommunikationsvorgangs, zur Bereitstellung bestimmter, von Ihnen
              erw&uuml;nschter Funktionen (z.&nbsp;B. f&uuml;r die
              Warenkorbfunktion) oder zur Optimierung der Website (z.&nbsp;B.
              Cookies zur Messung des Webpublikums) erforderlich sind
              (notwendige Cookies), werden auf Grundlage von Art. 6 Abs. 1 lit.
              f DSGVO gespeichert, sofern keine andere Rechtsgrundlage angegeben
              wird. Der Websitebetreiber hat ein berechtigtes Interesse an der
              Speicherung von notwendigen Cookies zur technisch fehlerfreien und
              optimierten Bereitstellung seiner Dienste. Sofern eine
              Einwilligung zur Speicherung von Cookies und vergleichbaren
              Wiedererkennungstechnologien abgefragt wurde, erfolgt die
              Verarbeitung ausschlie&szlig;lich auf Grundlage dieser
              Einwilligung (Art. 6 Abs. 1 lit. a DSGVO und &sect; 25 Abs. 1
              TTDSG); die Einwilligung ist jederzeit widerrufbar.
            </p>{' '}
            <p>
              Sie k&ouml;nnen Ihren Browser so einstellen, dass Sie &uuml;ber
              das Setzen von Cookies informiert werden und Cookies nur im
              Einzelfall erlauben, die Annahme von Cookies f&uuml;r bestimmte
              F&auml;lle oder generell ausschlie&szlig;en sowie das automatische
              L&ouml;schen der Cookies beim Schlie&szlig;en des Browsers
              aktivieren. Bei der Deaktivierung von Cookies kann die
              Funktionalit&auml;t dieser Website eingeschr&auml;nkt sein.
            </p>{' '}
            <p>
              Welche Cookies und Dienste auf dieser Website eingesetzt werden,
              k&ouml;nnen Sie dieser Datenschutzerkl&auml;rung entnehmen.
            </p>
            <Headline className='mt-4' type='h3'>
              Kontaktformular
            </Headline>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden
              Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort
              angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und
              f&uuml;r den Fall von Anschlussfragen (Art. 6 Abs. 1 DSGVO) durch
              den Dienstleister Formspree.io Inc. an uns weitergeleitet. Diese
              Daten geben wir nicht ohne Ihre Einwilligung weiter. Die
              Übermittlung an Formspree.io Inc. erfolgt über das
              HTTPS-Protokoll. Als Ergebnis erhalten wir eine unverschlüsselte
              E-Mail von Formspree.io Inc. mit den von Ihnen eingegebenen Daten.
              Formspree.io Inc. ist ein US-amerikanischer Dienstleister und
              unterwirft sich nach den Regeln des Privacy Shield den Vorgaben
              der EU (EU-DSGVO).
            </p>{' '}
            <p>
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6
              Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erf&uuml;llung
              eines Vertrags zusammenh&auml;ngt oder zur Durchf&uuml;hrung
              vorvertraglicher Ma&szlig;nahmen erforderlich ist. In allen
              &uuml;brigen F&auml;llen beruht die Verarbeitung auf unserem
              berechtigten Interesse an der effektiven Bearbeitung der an uns
              gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer
              Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt
              wurde; die Einwilligung ist jederzeit widerrufbar.
            </p>{' '}
            <p>
              Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei
              uns, bis Sie uns zur L&ouml;schung auffordern, Ihre Einwilligung
              zur Speicherung widerrufen oder der Zweck f&uuml;r die
              Datenspeicherung entf&auml;llt (z.&nbsp;B. nach abgeschlossener
              Bearbeitung Ihrer Anfrage). Zwingende gesetzliche Bestimmungen
              &ndash; insbesondere Aufbewahrungsfristen &ndash; bleiben
              unber&uuml;hrt.
            </p>
            <Headline className='mt-4' type='h2'>
              5. Plugins und Tools
            </Headline>
            <Headline className='mt-4' type='h3'>
              Google Fonts
            </Headline>
            <p>
              Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten
              so genannte Google Fonts, die von Google bereitgestellt werden.
              Beim Aufruf einer Seite l&auml;dt Ihr Browser die ben&ouml;tigten
              Fonts in ihren Browsercache, um Texte und Schriftarten korrekt
              anzuzeigen.
            </p>{' '}
            <p>
              Zu diesem Zweck muss der von Ihnen verwendete Browser Verbindung
              zu den Servern von Google aufnehmen. Hierdurch erlangt Google
              Kenntnis dar&uuml;ber, dass &uuml;ber Ihre IP-Adresse diese
              Website aufgerufen wurde. Die Nutzung von Google Fonts erfolgt auf
              Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat
              ein berechtigtes Interesse an der einheitlichen Darstellung des
              Schriftbildes auf seiner Website. Sofern eine entsprechende
              Einwilligung abgefragt wurde, erfolgt die Verarbeitung
              ausschlie&szlig;lich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO
              und &sect; 25 Abs. 1 TTDSG, soweit die Einwilligung die
              Speicherung von Cookies oder den Zugriff auf Informationen im
              Endger&auml;t des Nutzers (z.&nbsp;B. Device-Fingerprinting) im
              Sinne des TTDSG umfasst. Die Einwilligung ist jederzeit
              widerrufbar.
            </p>{' '}
            <p>
              Wenn Ihr Browser Google Fonts nicht unterst&uuml;tzt, wird eine
              Standardschrift von Ihrem Computer genutzt.
            </p>{' '}
            <p>
              Weitere Informationen zu Google Fonts finden Sie unter{' '}
              <a
                href='https://developers.google.com/fonts/faq'
                target='_blank'
                rel='noopener noreferrer'
              >
                https://developers.google.com/fonts/faq
              </a>{' '}
              und in der Datenschutzerkl&auml;rung von Google:{' '}
              <a
                href='https://policies.google.com/privacy?hl=de'
                target='_blank'
                rel='noopener noreferrer'
              >
                https://policies.google.com/privacy?hl=de
              </a>
              .
            </p>
            <p>
              Das Unternehmen verf&uuml;gt &uuml;ber eine Zertifizierung nach
              dem &bdquo;EU-US Data Privacy Framework&ldquo; (DPF). Der DPF ist
              ein &Uuml;bereinkommen zwischen der Europ&auml;ischen Union und
              den USA, der die Einhaltung europ&auml;ischer Datenschutzstandards
              bei Datenverarbeitungen in den USA gew&auml;hrleisten soll. Jedes
              nach dem DPF zertifizierte Unternehmen verpflichtet sich, diese
              Datenschutzstandards einzuhalten. Weitere Informationen hierzu
              erhalten Sie vom Anbieter unter folgendem Link:{' '}
              <a
                href='https://www.dataprivacyframework.gov/s/participant-search/participant-detail?contact=true&id=a2zt000000001L5AAI&status=Active'
                target='_blank'
                rel='noopener noreferrer'
              >
                https://www.dataprivacyframework.gov/s/participant-search/participant-detail?contact=true&id=a2zt000000001L5AAI&status=Active
              </a>
            </p>
            <p>
              Quelle:{' '}
              <a href='https://www.e-recht24.de'>https://www.e-recht24.de</a>
            </p>
            <Headline className='mt-4' type='h2'>
              Cloud-Dienste
            </Headline>
            <table>
              <tbody>
                <tr>
                  <td>
                    <strong>
                      Cloud-Dienste Datenschutzerklärung Zusammenfassung
                    </strong>
                    <br />
                    &#x1f465; Betroffene: Wir als Websitebetreiber und Sie als
                    Websitebesucher
                    <br />
                    &#x1f91d; Zweck: Sicherheit und Datenspeicherung
                    <br />
                    &#x1f4d3; Verarbeitete Daten: Daten wie etwa Ihre
                    IP-Adresse, Name oder technische Daten wie etwa
                    Browserversion
                    <br />
                    Mehr Details dazu finden Sie weiter unten und den einzelnen
                    Datenschutztexten bzw. in den Datenschutzerklärungen der
                    Anbieter
                    <br />
                    &#x1f4c5; Speicherdauer: meisten werden die Daten solange
                    gespeichert, bis sie zur Erfüllung der Dienstleistung nicht
                    mehr benötigt werden
                    <br />
                    &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. a
                    DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO
                    (Berechtigte Interessen)
                  </td>
                </tr>
              </tbody>
            </table>
            <Headline className='mt-4' type='h3'>
              Was sind Cloud-Dienste?
            </Headline>
            <p>
              Cloud-Dienste stellen uns als Websitebetreiber Speicherplatz und
              Rechenleistung über das Internet zur Verfügung. Über das Internet
              können Daten an ein externes System übertragen, verarbeitet und
              gespeichert werden. Die Verwaltung dieser Daten übernimmt der
              entsprechende Cloud-Anbieter. Je nach Anforderung kann eine
              einzelne Person oder auch ein Unternehmen die Speicherplatzgröße
              oder Rechenleistung wählen. Zugegriffen wird auf Cloud-Speicher
              über eine API oder über Speicherprotokolle. API steht für
              Application Programming Interface und gemeint ist damit eine
              Programmierschnittstelle, die Software- mit Hardwarekomponenten
              verbindet.
            </p>
            <Headline className='mt-4' type='h3'>
              Warum verwenden wir Cloud-Dienste?
            </Headline>
            <p>
              Wir nutzen Cloud-Dienste aus mehreren Gründen. Ein Cloud-Dienst
              bietet uns die Möglichkeit unsere Daten sicher zu speichern. Zudem
              haben wir von verschiedenen Orten und Geräten Zugriff auf die
              Daten und verfügen damit über mehr Flexibilität und erleichtern
              unsere Arbeitsprozesse. Ein Cloud-Speicher erspart uns auch
              Kosten, weil wir keine eigene Infrastruktur für Datenspeicherung
              und Datensicherheit errichten und verwalten müssen. Durch die
              zentrale Speicherung unserer Daten in der Cloud können wir auch
              unsere Anwendungsfelder erweitern und unsere Informationen
              deutlich besser verwalten.
            </p>
            <p>
              Wir als Websitebetreiber bzw. als Unternehmen setzen Cloud-Dienste
              also in erster Linie für unsere eigenen Zwecke ein. Zum Beispiel
              nutzen wir die Dienste, um unseren Kalender zu verwalten, um
              Dokumente oder andere wichtige Informationen in der Cloud zu
              speichern. Dabei können allerdings auch personenbezogene Daten von
              Ihnen gespeichert werden. Dies ist beispielsweise dann der Fall,
              wenn Sie uns Ihre Kontaktdaten (etwa Name und E-Mail-Adresse) zu
              Verfügung stellen und wir unsere Kundendaten bei einem
              Cloud-Anbieter speichern. Folglich können Daten, die wir von Ihnen
              verarbeiten auch auf externen Servern abgelegt und verarbeitet
              werden. Wenn wir auf unserer Website bestimmte Formulare oder
              Inhalte von Cloud-Diensten anbieten, können auch Cookies für
              Webanalysen und Werbezwecke gesetzt werden. Weiters merken sich
              solche Cookies Ihre Einstellungen (wie z. B. die verwendete
              Sprache), damit Sie beim nächsten Besuch auf unserer Website Ihre
              gewohnte Webumgebung vorfinden.
            </p>
            <Headline className='mt-4' type='h3'>
              Welche Daten werden durch Cloud-Dienste verarbeitet?
            </Headline>
            <p>
              Viele von uns in der Cloud gespeicherten Daten haben keinen
              Personenbezug, einige Daten zählen jedoch, nach Definition der
              DSGVO, zu personenbezogenen Daten. Häufig handelt es sich um
              Kundendaten wie Name, Adresse, IP-Adresse oder Telefonnummer oder
              um technische Gerätinformationen. In der Cloud können des Weiteren
              auch Videos, Bilder und Audiodateien gespeichert werden. Wie die
              Daten genau erhoben und gespeichert werden, hängt vom jeweiligen
              Dienst ab. Wir versuchen nur Dienste zu nutzen, die sehr
              vertrauenswürdig und professionell mit den Daten umgehen.
              Grundsätzlich haben die Dienste, wie etwa Amazon Drive, Zugriff
              auf die gespeicherten Dateien, um ihren eigenen Service
              entsprechend anbieten zu können. Dafür benötigen die Dienste
              allerdings Genehmigungen wie beispielsweise das Recht Dateien
              wegen Sicherheitsaspekten zu kopieren. Diese Daten werden im
              Rahmen der Services und unter Einhaltung der geltenden Gesetze
              verarbeitet und verwaltet. Dazu zählt auch bei US-amerikanischen
              Anbietern (über die Standardvertragsklauseln) die DSGVO. Diese
              Cloud-Dienste arbeiten in einigen Fällen auch mit Drittanbietern
              zusammen, die unter Anweisung und in Übereinstimmung mit den
              Datenschutzrichtlinien und weiteren Sicherheitsmaßnahmen Daten
              verarbeiten können. Wir möchten an dieser Stelle nochmals betonen,
              dass sich alle bekannten Cloud-Dienste (wie Amazon Drive, Google
              Drive oder Microsoft Onedrive) das Recht einholen, Zugriff auf
              gespeicherte Inhalte zu haben, um ihr eigenes Service entsprechend
              anbieten und optimieren zu können.
            </p>
            <Headline className='mt-4' type='h3'>
              Dauer der Datenverarbeitung
            </Headline>
            <p>
              Über die Dauer der Datenverarbeitung informieren wir Sie weiter
              unten, sofern wir weitere Informationen dazu haben. Im Allgemeinen
              speichern Cloud-Dienste Daten, bis Sie oder wir die
              Datenspeicherung widerrufen bzw. die Daten wieder löschen.
              Generell werden personenbezogene Daten nur so lange gespeichert,
              wie es für die Bereitstellung der Dienstleistungen unbedingt
              notwendig ist. Ein endgültiges Datenlöschen aus der Cloud kann
              allerdings einige Monate dauern. Das ist der Fall, weil die Daten
              meist nicht nur auf einem Server gespeichert sind, sondern auf
              verschiedenen Servern aufgeteilt werden.
            </p>
            <Headline className='mt-4' type='h3'>
              Widerspruchsrecht
            </Headline>
            <p>
              Sie haben auch jederzeit das Recht und die Möglichkeit Ihre
              Einwilligung zur Datenspeicherung in einer Cloud zu widerrufen.
              Falls Cookies verwendet werden, haben Sie auch hier ein
              Widerrufsrecht. Das funktioniert entweder über unser
              Cookie-Management-Tool oder über andere Opt-Out-Funktionen. Zum
              Beispiel können Sie auch die Datenerfassung durch Cookies
              verhindern, indem Sie in Ihrem Browser die Cookies verwalten,
              deaktivieren oder löschen. Wir empfehlen Ihnen auch unsere
              allgemeine Datenschutzerklärung über Cookies. Um zu erfahren,
              welche Daten von Ihnen genau gespeichert und verarbeitet werden,
              sollten Sie die Datenschutzerklärungen der jeweiligen
              Cloud-Anbieter durchlesen.
            </p>
            <Headline className='mt-4' type='h3'>
              Rechtsgrundlage
            </Headline>
            <p>
              Wir setzen Cloud-Dienste hauptsächlich auf Grundlage unserer
              berechtigten Interessen (Art. 6 Abs. 1 lit. f DSGVO) an einem
              guten Sicherheits- und Speichersystem ein.
            </p>
            <p>
              Bestimmte Verarbeitungen, insbesondere der Einsatz von Cookies
              sowie die Nutzung von Speicherfunktionen bedürfen Ihrer
              Einwilligung. Wenn Sie eingewilligt haben, dass Daten von Ihnen
              bei Cloud-Diensten verarbeitet und gespeichert werden können, gilt
              diese Einwilligung als Rechtsgrundlage der Datenverarbeitung (Art.
              6 Abs. 1 lit. a DSGVO). Die meisten von uns verwendeten Dienste
              setzen Cookies in Ihrem Browser, um Daten zu speichern. Darum
              empfehlen wir Ihnen, unseren Datenschutztext über Cookies genau
              durchzulesen und die Datenschutzerklärung oder die
              Cookie-Richtlinien des jeweiligen Dienstanbieters anzusehen.
            </p>
            <p>
              Informationen zu speziellen Tools erfahren Sie &#8211; sofern
              vorhanden &#8211; in den folgenden Abschnitten.
            </p>
            <Headline className='mt-4' type='h2'>
              Online-Kartendienste Einleitung
            </Headline>
            <table>
              <tbody>
                <tr>
                  <td>
                    <strong>
                      Online-Kartendienste Datenschutzerklärung Zusammenfassung
                    </strong>
                    <br />
                    &#x1f465; Betroffene: Besucher der Website
                    <br />
                    &#x1f91d; Zweck: Verbesserung der Nutzererfahrung
                    <br />
                    &#x1f4d3; Verarbeitete Daten: Welche Daten verarbeitet
                    werden, hängt stark von den verwendeten Diensten ab. Meist
                    handelt es sich um IP-Adresse, Standortdaten,
                    Suchgegenstände und/oder technische Daten. Mehr Details dazu
                    finden Sie bei den jeweils eingesetzten Tools.
                    <br />
                    &#x1f4c5; Speicherdauer: abhängig von den eingesetzten Tools
                    <br />
                    &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. a
                    DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO
                    (Berechtigte Interessen)
                  </td>
                </tr>
              </tbody>
            </table>
            <Headline className='mt-4' type='h3'>
              Was sind Online-Kartendienste?
            </Headline>
            <p>
              Wir nutzen für unsere Website als erweitertes Service auch
              Onlinekarten-Dienste. Google Maps ist wohl jener Dienst, der Ihnen
              am meisten bekannt ist, aber es gibt auch noch andere Anbieter,
              die sich auf das Erstellen digitaler Landkarten spezialisiert
              haben. Solche Dienste ermöglichen es, Standorte, Routenpläne oder
              andere geografische Informationen direkt über unsere Website
              anzeigen zu lassen. Durch einen eingebundenen Kartendienst müssen
              Sie unsere Website nicht mehr verlassen, um zum Beispiel die Route
              zu einem Standort anzusehen. Damit die Onlinekarte in unserer
              Website auch funktioniert werden mittels HTML-Code
              Kartenausschnitte eingebunden. Die Dienste können dann
              Straßenkarten, die Erdoberfläche oder Luft- bzw. Satellitenbilder
              anzeigen. Wenn Sie das eingebaute Kartenangebot nutzen, werden
              auch Daten an das verwendete Tool übertragen und dort gespeichert.
              Unter diesen Daten können sich auch personenbezogene Daten
              befinden.
            </p>
            <Headline className='mt-4' type='h3'>
              Warum verwenden wir Online-Kartendienste auf unserer Website?
            </Headline>
            <p>
              Ganz allgemein gesprochen ist es unser Anliegen, Ihnen auf unserer
              Website eine angenehme Zeit zu bieten. Und angenehm ist Ihre Zeit
              natürlich nur, wenn Sie sich auf unserer Website leicht
              zurechtfinden und alle Informationen, die Sie brauchen schnell und
              einfach finden. Daher haben wir uns gedacht, ein
              Online-Kartensystem könnte noch eine deutliche Optimierung unseres
              Service auf der Website sein. Ohne unsere Website zu verlassen,
              können Sie sich mit Hilfe des Kartensystems Routenbeschreibungen,
              Standorte oder auch Sehenswürdigkeiten problemlos ansehen.
              Superpraktisch ist natürlich auch, dass Sie so auf einen Blick
              sehen, wo wir unseren Firmensitz haben, damit Sie schnell und
              sicher zu uns finden. Sie sehen, es gibt einfach viele Vorteile
              und wir betrachten Online-Kartendienste auf unserer Website ganz
              klar als Teil unseres Kundenservice.
            </p>
            <Headline className='mt-4' type='h3'>
              Welche Daten werden von Online-Kartendiensten gespeichert?
            </Headline>
            <p>
              Wenn Sie eine Seite auf unserer Website öffnen, die eine
              Online-Kartenfunktion eingebaut hat, können personenbezogene Daten
              an den jeweiligen Dienst übermittelt und dort gespeichert werden.
              Meistens handelt es sich dabei um Ihre IP-Adresse, durch die auch
              Ihr ungefährer Standpunkt ermittelt werden kann. Neben der
              IP-Adresse werden auch Daten wie eingegebene Suchbegriffe sowie
              Längen- und Breitenkoordinaten gespeichert. Wenn Sie etwa eine
              Adresse für eine Routenplanung eingeben, werden auch diese Daten
              gespeichert. Die Daten werden nicht bei uns, sondern auf den
              Servern der eingebundenen Tools gespeichert. Sie können sich das
              ungefähr so vorstellen: Sie befinden sich zwar auf unserer
              Website, jedoch wenn Sie mit einem Kartendienst interagieren,
              passiert diese Interaktion eigentlich auf deren Website. Damit der
              Dienst einwandfrei funktioniert, wird in der Regel auch mindestens
              ein Cookie in Ihrem Browser gesetzt. Google Maps nutzt
              beispielsweise auch Cookies, um ein Userverhalten aufzuzeichnen
              und somit den eigenen Dienst zu optimieren und personalisierte
              Werbung schalten zu können. Mehr über Cookies erfahren Sie in
              unserem Abschnitt „Cookies“.
            </p>
            <Headline className='mt-4' type='h3'>
              Wie lange und wo werden die Daten gespeichert?
            </Headline>
            <p>
              Jeder Online-Kartendienst verarbeitet unterschiedliche Userdaten.
              Sofern uns weitere Informationen vorliegen, informieren wir Sie
              über die Dauer der Datenverarbeitung weiter unten in den
              entsprechenden Abschnitten zu den einzelnen Tools. Grundsätzlich
              werden personenbezogene Daten stets nur so lange aufbewahrt, wie
              es für die Dienstbereitstellung nötig ist. Google Maps
              beispielsweise speichert gewisse Daten für einen festgelegte
              Zeitraum, andere Daten müssen Sie wiederum selbst löschen. Bei
              Mapbox wird etwa die IP-Adresse für 30 Tage aufbewahrt und
              anschließend gelöscht. Sie sehen, jedes Tool speichert Daten
              unterschiedlich lange. Daher empfehlen wir Ihnen, die
              Datenschutzerklärungen der eingesetzten Tools genau anzusehen.
            </p>
            <p>
              Die Anbieter verwenden auch Cookies, um Daten zu Ihrem
              Userverhalten mit dem Kartendienst zu speichern. Mehr allgemeine
              Informationen zu Cookies finden Sie in unserem Abschnitt
              „Cookies“, aber auch in den Datenschutztexten der einzelnen
              Anbieter erfahren Sie, welche Cookies zum Einsatz kommen können.
              Meistens handelt es sich dabei allerdings nur um eine
              beispielhafte Liste und ist nicht vollständig.
            </p>
            <Headline className='mt-4' type='h3'>
              Widerspruchsrecht
            </Headline>
            <p>
              Sie haben immer die Möglichkeit und auch das Recht auf Ihre
              personenbezogenen Daten zuzugreifen und auch gegen die Nutzung und
              Verarbeitung Einspruch zu erheben. Sie können auch jederzeit Ihre
              Einwilligung, die Sie uns erteilt haben, widerrufen. In der Regel
              funktioniert das am einfachsten über das Cookie-Consent-Tool. Es
              gibt aber auch noch weitere Opt-Out-Tools, die Sie nutzen können.
              Mögliche Cookies, die von den verwendeten Anbietern gesetzt
              werden, können Sie mit wenigen Mausklicks auch selbst verwalten,
              löschen oder deaktivieren. Es kann dann allergings vorkommen, dass
              einige Funktionen des Dienstes nicht mehr wie gewohnt
              funktionieren. Wie Sie in Ihrem Browser die Cookies verwalten,
              hängt auch von Ihrem benutzten Browser ab. Im Abschnitt „Cookies“
              finden Sie auch Links zu den Anleitungen der wichtigsten Browser.
            </p>
            <Headline className='mt-4' type='h3'>
              Rechtsgrundlage
            </Headline>
            <p>
              Wenn Sie eingewilligt haben, dass ein Online-Kartendienst
              eingesetzt werden darf, ist die Rechtsgrundlage der entsprechenden
              Datenverarbeitung diese Einwilligung. Diese Einwilligung stellt
              laut Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) die Rechtsgrundlage
              für die Verarbeitung personenbezogener Daten, wie sie bei der
              Erfassung durch einen Online-Kartendienst vorkommen kann, dar.
            </p>
            <p>
              Wir haben zudem auch ein berechtigtes Interesse, einen
              Online-Kartendienst zu verwenden, um unser Service auf unserer
              Website zu optimieren. Die dafür entsprechende Rechtsgrundlage ist
              Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen). Wir setzen
              einen Online-Kartendienst allerdings immer nur dann ein, wenn Sie
              eine Einwilligung erteilt haben. Das wollen wir an dieser Stelle
              unbedingt nochmals festgehalten haben.
            </p>
            <p>
              Informationen zu speziellen Online-Kartendiensten erhalten Sie
              &#8211; sofern vorhanden &#8211; in den folgenden Abschnitten.
            </p>
            <Headline className='mt-4' type='h2'>
              Google Maps Datenschutzerklärung
            </Headline>
            <table>
              <tbody>
                <tr>
                  <td>
                    <strong>
                      Google Maps Datenschutzerklärung Zusammenfassung
                    </strong>
                    <br />
                    &#x1f465; Betroffene: Besucher der Website
                    <br />
                    &#x1f91d; Zweck: Optimierung unserer Serviceleistung
                    <br />
                    &#x1f4d3; Verarbeitete Daten: Daten wie etwa eingegebene
                    Suchbegriffe, Ihre IP-Adresse und auch die Breiten- bzw.
                    Längenkoordinaten.
                    <br />
                    Mehr Details dazu finden Sie weiter unten in dieser
                    Datenschutzerklärung.
                    <br />
                    &#x1f4c5; Speicherdauer: abhängig von den gespeicherten
                    Daten
                    <br />
                    &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. a
                    DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO
                    (Berechtigte Interessen)
                  </td>
                </tr>
              </tbody>
            </table>
            <Headline className='mt-4' type='h3'>
              Was ist Google Maps?
            </Headline>
            <p>
              Wir benützen auf unserer Website Google Maps der Firma Google Inc.
              Für den europäischen Raum ist das Unternehmen Google Ireland
              Limited (Gordon House, Barrow Street Dublin 4, Irland) für alle
              Google-Dienste verantwortlich. Mit Google Maps können wir Ihnen
              Standorte besser zeigen und damit unser Service an Ihre
              Bedürfnisse anpassen. Durch die Verwendung von Google Maps werden
              Daten an Google übertragen und auf den Google-Servern gespeichert.
              Hier wollen wir nun genauer darauf eingehen, was Google Maps ist,
              warum wir diesen Google-Dienst in Anspruch nehmen, welche Daten
              gespeichert werden und wie Sie dies unterbinden können.
            </p>
            <p>
              Google Maps ist ein Internet-Kartendienst der Firma Google. Mit
              Google Maps können Sie online über einen PC, ein Tablet oder eine
              App genaue Standorte von Städten, Sehenswürdigkeiten, Unterkünften
              oder Unternehmen suchen. Wenn Unternehmen auf Google My Business
              vertreten sind, werden neben dem Standort noch weitere
              Informationen über die Firma angezeigt. Um die Anfahrtsmöglichkeit
              anzuzeigen, können Kartenausschnitte eines Standorts mittels
              HTML-Code in eine Website eingebunden werden. Google Maps zeigt
              die Erdoberfläche als Straßenkarte oder als Luft- bzw.
              Satellitenbild. Dank der Street View Bilder und den hochwertigen
              Satellitenbildern sind sehr genaue Darstellungen möglich.
            </p>
            <Headline className='mt-4' type='h3'>
              Warum verwenden wir Google Maps auf unserer Website?
            </Headline>
            <p>
              All unsere Bemühungen auf dieser Seite verfolgen das Ziel, Ihnen
              eine nützliche und sinnvolle Zeit auf unserer Webseite zu bieten.
              Durch die Einbindung von Google Maps können wir Ihnen die
              wichtigsten Informationen zu diversen Standorten liefern. Sie
              sehen auf einen Blick wo wir unseren Firmensitz haben. Die
              Wegbeschreibung zeigt Ihnen immer den besten bzw. schnellsten Weg
              zu uns. Sie können den Anfahrtsweg für Routen mit dem Auto, mit
              öffentlichen Verkehrsmitteln, zu Fuß oder mit dem Fahrrad abrufen.
              Für uns ist die Bereitstellung von Google Maps Teil unseres
              Kundenservice.
            </p>
            <Headline className='mt-4' type='h3'>
              Welche Daten werden von Google Maps gespeichert?
            </Headline>
            <p>
              Damit Google Maps ihren Dienst vollständig anbieten kann, muss das
              Unternehmen Daten von Ihnen aufnehmen und speichern. Dazu zählen
              unter anderem die eingegebenen Suchbegriffe, Ihre IP-Adresse und
              auch die Breiten- bzw. Längenkoordinaten. Benutzen Sie die
              Routenplaner-Funktion wird auch die eingegebene Startadresse
              gespeichert. Diese Datenspeicherung passiert allerdings auf den
              Webseiten von Google Maps. Wir können Sie darüber nur informieren,
              aber keinen Einfluss nehmen. Da wir Google Maps in unsere Webseite
              eingebunden haben, setzt Google mindestens ein Cookie (Name: NID)
              in Ihrem Browser. Dieses Cookie speichert Daten über Ihr
              Userverhalten. Google nutzt diese Daten in erster Linie, um eigene
              Dienste zu optimieren und individuelle, personalisierte Werbung
              für Sie bereitzustellen.
            </p>
            <p>
              <strong>Anmerkung:</strong> Wir können bei den Angaben der
              gespeicherten Daten keine Vollständigkeit gewährleisten. Speziell
              bei der Verwendung von Cookies sind Veränderungen nie
              auszuschließen. Um das Cookie NID zu identifizieren, wurde eine
              eigene Testseite angelegt, wo ausschließlich Google Maps
              eingebunden war.
            </p>
            <Headline className='mt-4' type='h3'>
              Wie lange und wo werden die Daten gespeichert?
            </Headline>
            <p>
              Die Google-Server stehen in Rechenzentren auf der ganzen Welt. Die
              meisten Server befinden sich allerdings in Amerika. Aus diesem
              Grund werden Ihre Daten auch vermehrt in den USA gespeichert. Hier
              können Sie genau nachlesen wo sich die Google-Rechenzentren
              befinden:{' '}
              <a
                href='https://www.google.com/about/datacenters/locations/?hl=de'
                target='_blank'
                rel='follow noopener'
              >
                https://www.google.com/about/datacenters/locations/?hl=de
              </a>
            </p>
            <p>
              Die Daten verteilt Google auf verschiedenen Datenträgern. Dadurch
              sind die Daten schneller abrufbar und werden vor etwaigen
              Manipulationsversuchen besser geschützt. Jedes Rechenzentrum hat
              auch spezielle Notfallprogramme. Wenn es zum Beispiel Probleme bei
              der Google-Hardware gibt oder eine Naturkatastrophe die Server
              lahm legt, bleiben die Daten ziemlich sicher trotzdem geschützt.
            </p>
            <p>
              Manche Daten speichert Google für einen festgelegten Zeitraum. Bei
              anderen Daten bietet Google lediglich die Möglichkeit, diese
              manuell zu löschen. Weiters anonymisiert das Unternehmen auch
              Informationen (wie zum Beispiel Werbedaten) in Serverprotokollen,
              indem es einen Teil der IP-Adresse und Cookie-Informationen nach 9
              bzw.18 Monaten löscht.
            </p>
            <Headline className='mt-4' type='h3'>
              Wie kann ich meine Daten löschen bzw. die Datenspeicherung
              verhindern?
            </Headline>
            <p>
              Mit der 2019 eingeführten automatischen Löschfunktion von
              Standort- und Aktivitätsdaten werden Informationen zur
              Standortbestimmung und Web-/App-Aktivität &#8211; abhängig von
              Ihrer Entscheidung &#8211; entweder 3 oder 18 Monate gespeichert
              und dann gelöscht. Zudem kann man diese Daten über das
              Google-Konto auch jederzeit manuell aus dem Verlauf löschen. Wenn
              Sie Ihre Standorterfassung vollständig verhindern wollen, müssen
              Sie im Google-Konto die Rubrik „Web- und App-Aktivität“ pausieren.
              Klicken Sie „Daten und Personalisierung“ und dann auf die Option
              „Aktivitätseinstellung“. Hier können Sie die Aktivitäten ein- oder
              ausschalten.
            </p>
            <p>
              In Ihrem Browser können Sie weiters auch einzelne Cookies
              deaktivieren, löschen oder verwalten. Je nach dem welchen Browser
              Sie verwenden, funktioniert dies immer etwas anders. Unter dem
              Abschnitt „Cookies“ finden Sie die entsprechenden Links zu den
              jeweiligen Anleitungen der bekanntesten Browser.
            </p>
            <p>
              Falls Sie grundsätzlich keine Cookies haben wollen, können Sie
              Ihren Browser so einrichten, dass er Sie immer informiert, wenn
              ein Cookie gesetzt werden soll. So können Sie bei jedem einzelnen
              Cookie entscheiden, ob Sie es erlauben oder nicht.
            </p>
            <Headline className='mt-4' type='h3'>
              Rechtsgrundlage
            </Headline>
            <p>
              Wenn Sie eingewilligt haben, dass Google Maps eingesetzt werden
              darf, ist die Rechtsgrundlage der entsprechenden Datenverarbeitung
              diese Einwilligung. Diese Einwilligung stellt laut
              <strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</strong> die
              Rechtsgrundlage für die Verarbeitung personenbezogener Daten, wie
              sie bei der Erfassung durch Google Maps vorkommen kann, dar.
            </p>
            <p>
              Von unserer Seite besteht zudem ein berechtigtes Interesse, Google
              Maps zu verwenden, um unser Online-Service zu optimieren. Die
              dafür entsprechende Rechtsgrundlage ist{' '}
              <strong>
                Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)
              </strong>
              . Wir setzen Google Maps gleichwohl nur ein, soweit Sie eine
              Einwilligung erteilt haben.
            </p>
            <p>
              Google verarbeitet Daten von Ihnen u.a. auch in den USA. Google
              ist aktiver Teilnehmer des EU-US Data Privacy Frameworks, wodurch
              der korrekte und sichere Datentransfer personenbezogener Daten von
              EU-Bürgern in die USA geregelt wird. Mehr Informationen dazu
              finden Sie auf{' '}
              <a
                href='https://commission.europa.eu/document/fa09cbad-dd7d-4684-ae60-be03fcb0fddf_en'
                target='_blank'
                rel='follow noopener'
              >
                {' '}
                https://commission.europa.eu/document/fa09cbad-dd7d-4684-ae60-be03fcb0fddf_en
              </a>
              .
            </p>
            <p>
              Zudem verwendet Google sogenannte Standardvertragsklauseln (= Art.
              46. Abs. 2 und 3 DSGVO). Standardvertragsklauseln (Standard
              Contractual Clauses – SCC) sind von der EU-Kommission
              bereitgestellte Mustervorlagen und sollen sicherstellen, dass Ihre
              Daten auch dann den europäischen Datenschutzstandards entsprechen,
              wenn diese in Drittländer (wie beispielsweise in die USA)
              überliefert und dort gespeichert werden. Durch das EU-US Data
              Privacy Framework und durch die Standardvertragsklauseln
              verpflichtet sich Google, bei der Verarbeitung Ihrer relevanten
              Daten, das europäische Datenschutzniveau einzuhalten, selbst wenn
              die Daten in den USA gespeichert, verarbeitet und verwaltet
              werden. Diese Klauseln basieren auf einem Durchführungsbeschluss
              der EU-Kommission. Sie finden den Beschluss und die entsprechenden
              Standardvertragsklauseln u.a. hier:{' '}
              <a
                href='https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj?locale=de'
                target='_blank'
                rel='follow noopener'
              >
                https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj?locale=de
              </a>
            </p>
            <p>
              Die Google Ads Datenverarbeitungsbedingungen (Google Ads Data
              Processing Terms), welche auf die Standardvertragsklauseln
              verweisen, finden Sie unter{' '}
              <a
                href='https://business.safety.google/intl/de/adsprocessorterms/'
                target='_blank'
                rel='follow noopener'
              >
                https://business.safety.google/intl/de/adsprocessorterms/
              </a>
              .
            </p>
            <p>
              Wenn Sie mehr über die Datenverarbeitung von Google erfahren
              wollen, empfehlen wir Ihnen die hauseigene Datenschutzerklärung
              des Unternehmens unter{' '}
              <a
                href='https://policies.google.com/privacy?hl=de'
                target='_blank'
                rel='noopener noreferrer'
              >
                https://policies.google.com/privacy?hl=de
              </a>
              .
            </p>
            <Headline className='mt-4' type='h2'>
              Mapbox API Datenschutzerklärung
            </Headline>
            <table>
              <tbody>
                <tr>
                  <td>
                    <strong>
                      Mapbox API Datenschutzerklärung Zusammenfassung
                    </strong>
                    <br />
                    &#x1f465; Betroffene: Besucher der Website
                    <br />
                    &#x1f91d; Zweck: Optimierung unserer Serviceleistung
                    <br />
                    &#x1f4d3; Verarbeitete Daten: Daten wie etwa IP-Adresse,
                    Browserinformationen, Ihr Betriebssystem, Inhalt der
                    Anfrage, eingeschränkte Standorts- und Nutzungsdaten
                    <br />
                    Mehr Details dazu finden Sie weiter unten in dieser
                    Datenschutzerklärung.
                    <br />
                    &#x1f4c5; Speicherdauer: die IP-Adresse wird nach 30 Tagen
                    gelöscht, ID-Daten nach 36 Monaten
                    <br />
                    &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. a
                    DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO
                    (Berechtigte Interessen)
                  </td>
                </tr>
              </tbody>
            </table>
            <Headline className='mt-4' type='h3'>
              Was ist Mapbox API?
            </Headline>
            <p>
              Auf unserer Website nutzen wir die Mapbox API des amerikanischen
              Software-Unternehmens Mapbox Inc., 740 15th Street NW, 5th Floor,
              District of Columbia 20005, USA. Mapbox ist ein Online-Kartentool
              (Open-Source-Mapping), das über eine Schnittstelle (API) abgerufen
              wird. Durch die Nutzung dieses Tools wird unter anderem Ihre
              IP-Adresse an Mapbox weitergeleitet und gespeichert. In dieser
              Datenschutzerklärung erfahren Sie mehr über die Funktionen des
              Tools, warum wir es verwenden und vor allem welche Daten
              gespeichert werden und wie Sie das verhindern können.
            </p>
            <p>
              Mapbox ist ein amerikanisches Software-Unternehmen, das
              benutzerdefinierte Online-Karten für Websites anbieten. Mit Mapbox
              kann man Inhalte auf unserer Website illustrieren oder
              beispielsweise Anfahrtswege grafisch darstellen. Die Karten können
              mit kleinen Code-Snippets (JavaScript-Code) sehr leicht in unsere
              Website eingebunden werden. Mapbox bietet unter anderem eine
              mobile-freundliche Umgebung, die Routenauskunft erfolgt in
              Echtzeit und Daten werden visualisiert dargestellt.
            </p>
            <Headline className='mt-4' type='h3'>
              Warum verwenden wir Mapbox API auf unserer Website?
            </Headline>
            <p>
              Wir wollen Ihnen auch auf unserer Website einen umfassenden
              Service bieten und dieser soll nicht einfach bei unseren
              Dienstleistungen oder Produkten enden. Nein, auch unsere gesamten
              Inhalte sollen Ihnen von Nutzen sein. Und dazu zählen zum Beispiel
              auch Anfahrtskarten, die Ihnen etwa den Weg zu unserem Unternehmen
              zeigen.
            </p>
            <Headline className='mt-4' type='h3'>
              Welche Daten werden von Mapbox API gespeichert?
            </Headline>
            <p>
              Wenn Sie eine unserer Unterseiten aufrufen, die eine Online-Karte
              von Mapbox eingebunden hat, können Daten über Ihr Nutzerverhalten
              gesammelt und gespeichert werden. Das muss sein, damit die
              eingebundenen Online-Karten einwandfrei funktionieren. Es kann
              auch sein, dass erhobene Daten durch Mapbox an Dritte
              weitergegeben werden, allerdings keine personenbezogenen Daten.
              Das geschieht entweder, wenn dies aus rechtlichen Gründen nötig
              ist oder wenn Mapbox ein anderes Unternehmen explizit beauftragt.
              Die Karteninhalte werden direkt an Ihren Browser übermittelt und
              in unsere Website eingebunden.
            </p>
            <p>
              Mapbox erfasst automatisch bestimmte technische Informationen,
              wenn Anfragen an die APIs gestellt werden. Dazu zählen neben Ihrer
              IP-Adresse etwa Browserinformationen, Ihr Betriebssystem, Inhalt
              der Anfrage, eingeschränkte Standorts- und Nutzungsdaten, die URL
              der besuchten Webseite und Datum und Uhrzeit des Websitebesuchs.
              Laut Mapbox werden die Daten nur zur Verbesserung der eigenen
              Produkte verwendet. Zudem sammelt Mapbox auch zufällig generierte
              IDs, um Nutzerverhalten zu analysieren und die Anzahl der aktiven
              User festzustellen.
            </p>
            <p>
              Wenn Sie eine unserer Unterseiten nutzen und mit einer
              Online-Karte interagieren, setzt Mapbox folgendes Cookie in Ihrem
              Browser:
            </p>
            <p>
              <strong>Name:</strong> session
              <br />
              <strong>Wert:</strong> ID
              <br />
              <strong>Verwendungszweck:</strong> Genauere Informationen über den
              Verwendungszweck des Cookies konnten wir bis dato noch nicht in
              Erfahrung bringen.
              <br />
              <strong>Ablaufdatum:</strong> nach einem Jahr
            </p>
            <Headline className='mt-4' type='h3'>
              Wie lange und wo werden Daten gespeichert?
            </Headline>
            <p>
              Die erhobenen Daten werden auf amerikanischen Servern des
              Unternehmens Mapbox gespeichert und verarbeitet. Ihre IP-Adresse
              wird aus Sicherheitsgründen für 30 Tage aufbewahrt und
              anschließend gelöscht. Zufällig generierte IDs (keine
              personenbezogenen Daten), die die Nutzung der APIs analysieren
              werden nach 36 Monaten wieder gelöscht.
            </p>
            <Headline className='mt-4' type='h3'>
              Wie kann ich meine Daten löschen bzw. die Datenspeicherung
              verhindern?
            </Headline>
            <p>
              Wenn Sie nicht wollen, dass Mapbox Daten über Sie bzw. Ihr
              Userverhalten verarbeitet, können Sie in Ihren
              Browsereinstellungen JavaScript deaktivieren. Natürlich können Sie
              dann allerdings auch die entsprechenden Funktionen nicht mehr im
              vollen Ausmaß nutzen.
            </p>
            <p>
              Sie haben jederzeit das Recht auf Ihre personenbezogenen Daten
              zuzugreifen und Einspruch gegen die Nutzung und Verarbeitung zu
              erheben. Cookies, die von Mapbox API möglicherweise gesetzt
              werden, können Sie in Ihrem Browser jederzeit verwalten, löschen
              oder deaktivieren. Dadurch funktioniert allerdings der Dienst
              eventuell nicht mehr vollständig. Bei jedem Browser funktioniert
              die Verwaltung, Löschung oder Deaktivierung von Cookies etwas
              anders. Unter dem Abschnitt „Cookies“ finden Sie die
              entsprechenden Links zu den jeweiligen Anleitungen der
              bekanntesten Browser.
            </p>
            <Headline className='mt-4' type='h3'>
              Rechtsgrundlage
            </Headline>
            <p>
              Wenn Sie eingewilligt haben, dass Mapbox API eingesetzt werden
              darf, ist die Rechtsgrundlage der entsprechenden Datenverarbeitung
              diese Einwilligung. Diese Einwilligung stellt laut
              <strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</strong> die
              Rechtsgrundlage für die Verarbeitung personenbezogener Daten, wie
              sie bei der Erfassung durch Mapbox API vorkommen kann, dar.
            </p>
            <p>
              Von unserer Seite besteht zudem ein berechtigtes Interesse, Mapbox
              API zu verwenden, um unser Online-Service zu optimieren. Die dafür
              entsprechende Rechtsgrundlage ist{' '}
              <strong>
                Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)
              </strong>
              . Wir setzen Mapbox API gleichwohl nur ein, soweit Sie eine
              Einwilligung erteilt haben.
            </p>
            <p>
              Mapbox verarbeitet Daten von Ihnen u.a. auch in den USA. Mapbox
              ist aktiver Teilnehmer des EU-US Data Privacy Frameworks, wodurch
              der korrekte und sichere Datentransfer personenbezogener Daten von
              EU-Bürgern in die USA geregelt wird. Mehr Informationen dazu
              finden Sie auf{' '}
              <a
                href='https://commission.europa.eu/document/fa09cbad-dd7d-4684-ae60-be03fcb0fddf_en'
                target='_blank'
                rel='follow noopener'
              >
                https://commission.europa.eu/document/fa09cbad-dd7d-4684-ae60-be03fcb0fddf_en
              </a>
              .
            </p>
            <p>
              Zudem verwendet Mapbox sogenannte Standardvertragsklauseln (= Art.
              46. Abs. 2 und 3 DSGVO). Standardvertragsklauseln (Standard
              Contractual Clauses – SCC) sind von der EU-Kommission
              bereitgestellte Mustervorlagen und sollen sicherstellen, dass Ihre
              Daten auch dann den europäischen Datenschutzstandards entsprechen,
              wenn diese in Drittländer (wie beispielsweise in die USA)
              überliefert und dort gespeichert werden. Durch das EU-US Data
              Privacy Framework und durch die Standardvertragsklauseln
              verpflichtet sich Mapbox, bei der Verarbeitung Ihrer relevanten
              Daten, das europäische Datenschutzniveau einzuhalten, selbst wenn
              die Daten in den USA gespeichert, verarbeitet und verwaltet
              werden. Diese Klauseln basieren auf einem Durchführungsbeschluss
              der EU-Kommission. Sie finden den Beschluss und die entsprechenden
              Standardvertragsklauseln u.a. hier:{' '}
              <a
                href='https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj?locale=de'
                target='_blank'
                rel='follow noopener'
              >
                https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj?locale=de
              </a>
              .
            </p>
            <p>
              Mehr über die Daten und Standardvertragsklauseln, die durch die
              Verwendung von Mapbox API verarbeitet werden, erfahren Sie in der
              Datenschutzerklärung auf{' '}
              <a
                href='https://www.mapbox.com/legal/privacy?tid=312893221'
                target='_blank'
                rel='noopener noreferrer'
              >
                https://www.mapbox.com/legal/privacy
              </a>
              .
            </p>
            <p>Alle Texte sind urheberrechtlich geschützt.</p>
            <p>
              Quelle: Erstellt mit dem{' '}
              <a
                href='https://www.adsimple.de/datenschutz-generator/'
                title='Datenschutz Generator Deutschland von AdSimple'
              >
                Datenschutz Generator Deutschland
              </a>{' '}
              von AdSimple
            </p>
          </div>
        </Box>
      </section>
    </Layout>
  );
}
