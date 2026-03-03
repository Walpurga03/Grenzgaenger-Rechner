/**
 * Hilfe-Texte und Erklärungen für alle Eingabefelder
 */

export interface HelpContent {
  title: string;
  content: React.ReactNode;
}

export const helpTexts: Record<string, HelpContent> = {
  grossSalary: {
    title: 'Bruttolohn (CHF)',
    content: (
      <>
        <p className="mb-3">
          Ihr <strong>monatlicher Bruttolohn</strong> in Schweizer Franken, den Sie von Ihrem Arbeitgeber in der Schweiz erhalten.
        </p>
        <p className="mb-3">
          <strong>Was wird berechnet?</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>AHV/IV/EO: 5.3% (Alters- und Hinterlassenenversicherung)</li>
          <li>ALV: 1.1% (Arbeitslosenversicherung)</li>
          <li>BVG: ~7% (Pensionskasse, ab 18 Jahren)</li>
          <li>KTG/NBU: ~2.4% (Krankentaggeld & Unfallversicherung)</li>
        </ul>
        <p className="text-sm text-slate-600">
          💡 Tipp: Schauen Sie auf Ihre Lohnabrechnung für den genauen Betrag.
        </p>
      </>
    ),
  },

  exchangeRate: {
    title: 'Wechselkurs (CHF → EUR)',
    content: (
      <>
        <p className="mb-3">
          Der <strong>Wechselkurs</strong> gibt an, wie viele Euro Sie für einen Schweizer Franken erhalten.
        </p>
        
        <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 mb-4">
          <p className="font-bold text-green-900 mb-2">💪 STAND 2026: CHF ist stärker als EUR!</p>
          <p className="text-sm text-green-800 mb-2">
            <strong>Aktueller Kurs:</strong> 1 CHF = ca. <strong>1,07 EUR</strong>
          </p>
          <p className="text-sm text-green-800 mb-3">
            Das bedeutet: Der Schweizer Franken ist mehr wert als der Euro!<br />
            Umgekehrt: 1 EUR = ca. 0,93 CHF
          </p>
          <p className="text-sm font-semibold text-green-900">
            💡 Die App lädt automatisch den aktuellen Kurs von der EZB
          </p>
        </div>
        
        <p className="mb-3">
          <strong>Automatische Aktualisierung:</strong> Klicken Sie auf den blauen Refresh-Button 🔄, 
          um den aktuellen Kurs von der Europäischen Zentralbank (EZB) zu laden.
        </p>
        
        <div className="space-y-2 mb-3">
          <p className="text-sm bg-blue-50 border border-blue-200 rounded p-3">
            <strong>Rechenbeispiel (Stand 2026):</strong><br />
            CHF 6.500 × 1,07 (Kurs) = EUR 6.955<br />
            CHF 7.042 × 1,07 (Kurs) = EUR 7.535
          </p>
        </div>
        
        <p className="mb-3">
          <strong>Weitere Quellen für aktuelle Kurse:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>Europäische Zentralbank (EZB) - offizieller Referenzkurs</li>
          <li>Ihre Bank oder Online-Banking</li>
          <li>Finanznachrichten-Portale (Google Finance, Bloomberg, etc.)</li>
          <li>
            <a 
              href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.de.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              EZB Referenzkurse
            </a>
          </li>
        </ul>
        
        <p className="text-sm text-slate-600">
          💡 Der Kurs schwankt täglich. Die App lädt beim Start automatisch den aktuellsten Wert 
          im Format "1 CHF = X EUR".
        </p>
      </>
    ),
  },

  age: {
    title: 'Alter',
    content: (
      <>
        <p className="mb-3">
          Ihr aktuelles <strong>Alter in Jahren</strong>.
        </p>
        <p className="mb-3">
          <strong>Warum ist das relevant?</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>BVG (Pensionskasse) gilt erst ab 18 Jahren</li>
          <li>Ab 25 Jahren steigen die BVG-Beiträge leicht</li>
          <li>Unterschiedliche Steuerfreibeträge je nach Alter</li>
        </ul>
      </>
    ),
  },

  salaryMonths: {
    title: 'Monatsgehälter pro Jahr',
    content: (
      <>
        <p className="mb-3">
          In der Schweiz gibt es verschiedene Modelle für die Gehaltszahlung:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-3">
          <li><strong>12 Monatsgehälter:</strong> Standard-Gehalt ohne Bonus</li>
          <li><strong>13 Monatsgehälter:</strong> Häufigste Form, oft als "13. Monatslohn" oder Weihnachtsgeld</li>
          <li><strong>14 Monatsgehälter:</strong> Seltener, mit zusätzlichem Urlaubs- oder Weihnachtsgeld</li>
        </ul>
        <p className="mb-3">
          <strong>Wie wird es berechnet?</strong>
        </p>
        <p className="mb-3">
          Das Jahresgehalt wird gleichmäßig auf 12 Monate verteilt. Bei 13 Gehältern wird Ihr Monatslohn mit 13/12 multipliziert.
        </p>
        <div className="space-y-2">
          <p className="text-sm bg-blue-50 border border-blue-200 rounded p-3">
            <strong>Beispiel 13 Gehälter:</strong> CHF 6'500 × 13/12 = CHF 7'041.67 pro Monat
          </p>
          <p className="text-sm bg-blue-50 border border-blue-200 rounded p-3">
            <strong>Beispiel 14 Gehälter:</strong> CHF 6'500 × 14/12 = CHF 7'583.33 pro Monat
          </p>
        </div>
        <p className="text-sm text-slate-600 mt-3">
          💡 Prüfen Sie Ihren Arbeitsvertrag für die genaue Anzahl der Monatsgehälter.
        </p>
      </>
    ),
  },

  maritalStatus: {
    title: 'Familienstand',
    content: (
      <>
        <p className="mb-3">
          Ihr <strong>Familienstand</strong> beeinflusst die Höhe der Quellensteuer in der Schweiz.
        </p>
        <p className="mb-3">
          <strong>Unterschiede:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li><strong>Ledig:</strong> Höhere Steuersätze</li>
          <li><strong>Verheiratet:</strong> Niedrigere Steuersätze durch Ehegattensplitting</li>
        </ul>
        <p className="text-sm text-slate-600">
          💡 Bei Verheirateten kann auch das Einkommen des Partners relevant sein.
        </p>
      </>
    ),
  },

  children: {
    title: 'Anzahl Kinder',
    content: (
      <>
        <p className="mb-3">
          Die <strong>Anzahl Ihrer Kinder</strong> reduziert die Steuerlast in beiden Ländern.
        </p>
        <p className="mb-3">
          <strong>Für jedes Kind können Sie angeben:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li><strong>Alter:</strong> Über 18 Jahre? (relevant für Familienbonus)</li>
          <li><strong>Wohnsituation:</strong> Wohnt noch zuhause?</li>
          <li><strong>Status:</strong> In Ausbildung/Student?</li>
        </ul>
        <p className="mb-3">
          <strong>Auswirkungen:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li><strong>Schweiz:</strong> Niedrigere Quellensteuer (~0.5% pro Kind)</li>
          <li><strong>Österreich Familienbonus Plus:</strong>
            <ul className="list-circle pl-5 mt-1">
              <li>Unter 18 Jahren: €166.68/Monat</li>
              <li>Über 18 Jahren (in Ausbildung): €54.18/Monat</li>
            </ul>
          </li>
        </ul>
        <p className="text-sm text-slate-600">
          💡 Kinder über 18 müssen zuhause wohnen und in Ausbildung sein, um förderberechtigt zu sein.
        </p>
      </>
    ),
  },

  commuterAllowance: {
    title: 'Pendlerpauschale (AT)',
    content: (
      <>
        <p className="mb-3">
          Die österreichische <strong>Pendlerpauschale</strong> ist ein steuerlicher Absetzbetrag für Grenzgänger.
        </p>
        
        <div className="mb-4">
          <p className="font-semibold mb-2">📍 Entfernung:</p>
          <p className="text-sm mb-2">
            Geben Sie die <strong>einfache Entfernung</strong> (eine Richtung) zwischen Ihrem Wohnort in Österreich 
            und Ihrer Arbeitsstätte in der Schweiz in Kilometern an.
          </p>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">🚆 Kleines Pendlerpauschale (Öffentliche Verkehrsmittel zumutbar):</p>
          <ul className="list-disc pl-5 space-y-1 text-sm mb-2">
            <li>20-40 km: €58/Monat (€696/Jahr)</li>
            <li>40-60 km: €113/Monat (€1.356/Jahr)</li>
            <li>Ab 60 km: €168/Monat (€2.016/Jahr)</li>
          </ul>
          <p className="text-xs text-slate-600 italic">
            Zumutbar = mindestens 50% der Fahrzeit mit öffentlichen Verkehrsmitteln möglich
          </p>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">🚗 Großes Pendlerpauschale (Öffentliche Verkehrsmittel unzumutbar):</p>
          <ul className="list-disc pl-5 space-y-1 text-sm mb-2">
            <li>2-20 km: €31/Monat (€372/Jahr)</li>
            <li>20-40 km: €123/Monat (€1.476/Jahr)</li>
            <li>40-60 km: €214/Monat (€2.568/Jahr)</li>
            <li>Ab 60 km: €306/Monat (€3.672/Jahr)</li>
          </ul>
          <p className="text-xs text-slate-600 italic">
            Unzumutbar = weniger als 50% der Fahrzeit mit öffentlichen Verkehrsmitteln möglich oder 
            Arbeitszeit vor 5:30 / nach 20:00 Uhr
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <p className="text-sm font-semibold text-yellow-900 mb-1">💡 Pendlerrechner:</p>
          <p className="text-sm text-yellow-800">
            Nutzen Sie den offiziellen <strong>Pendlerrechner</strong> auf{' '}
            <a 
              href="https://pendlerrechner.bmf.gv.at/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-yellow-900"
            >
              pendlerrechner.bmf.gv.at
            </a>{' '}
            für eine exakte Berechnung Ihrer individuellen Situation.
          </p>
        </div>
      </>
    ),
  },

  familyBonus: {
    title: 'Familienbonus Plus (AT)',
    content: (
      <>
        <p className="mb-3">
          Der <strong>Familienbonus Plus</strong> ist ein österreichischer Steuerabsetzbetrag für Kinder.
        </p>
        <p className="mb-3">
          <strong>Höhe pro Kind:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li><strong>Bis 18 Jahre:</strong> €166.68 pro Monat</li>
          <li><strong>Ab 18 Jahre:</strong> €54.18 pro Monat</li>
        </ul>
        <p className="text-sm bg-green-50 border border-green-200 rounded p-3">
          <strong>Beispiel:</strong> Bei 2 Kindern unter 18: 2 × €166.68 = €333.36/Monat
        </p>
        <p className="text-sm text-slate-600 mt-3">
          💡 Wird direkt von der Steuerschuld abgezogen, nicht vom Einkommen.
        </p>
      </>
    ),
  },

  soleEarnerBonus: {
    title: 'Alleinverdienerabsetzbetrag (AT)',
    content: (
      <>
        <p className="mb-3">
          Der <strong>Alleinverdienerabsetzbetrag</strong> ist ein österreichischer Steuerabsetzbetrag 
          für Alleinverdiener/innen mit mindestens einem Kind.
        </p>
        
        <div className="mb-4">
          <p className="font-semibold mb-2">✅ Voraussetzungen:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm mb-2">
            <li>Sie haben mindestens <strong>1 Kind</strong></li>
            <li>Ihr(e) (Ehe-)Partner/in verdient <strong>weniger als EUR 6.937 pro Jahr</strong></li>
            <li>Sie leben in einem gemeinsamen Haushalt</li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">💰 Höhe des Absetzbetrags (jährlich):</p>
          <ul className="list-disc pl-5 space-y-1 text-sm mb-2">
            <li><strong>Mit 1 Kind:</strong> EUR 572/Jahr (EUR 47,67/Monat)</li>
            <li><strong>Mit 2 Kindern:</strong> EUR 778/Jahr (EUR 64,83/Monat)</li>
            <li><strong>Mit 3 Kindern:</strong> EUR 984/Jahr (EUR 82,00/Monat)</li>
            <li><strong>Jedes weitere Kind:</strong> + EUR 206/Jahr (+ EUR 17,17/Monat)</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
          <p className="text-sm font-semibold text-green-900 mb-1">Beispiel:</p>
          <p className="text-sm text-green-800">
            Sie haben 2 Kinder und Ihr Partner ist nicht berufstätig:<br />
            EUR 572 + EUR 206 = <strong>EUR 778/Jahr</strong> direkt von der Steuerschuld abgezogen
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <p className="text-sm font-semibold text-yellow-900 mb-1">💡 Wichtig:</p>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Wird direkt von der Steuerschuld abgezogen</li>
            <li>• Nicht kombinierbar mit Alleinerzieherabsetzbetrag</li>
            <li>• Partner-Einkommen darf EUR 6.937/Jahr nicht überschreiten</li>
          </ul>
        </div>
      </>
    ),
  },

  insuranceContribution: {
    title: 'Versicherungsbeitrag (AT) - Sonderausgaben',
    content: (
      <>
        <p className="mb-3">
          Hier können Sie Ihre <strong>österreichischen Versicherungsbeiträge</strong> eintragen, 
          die Sie monatlich als Grenzgänger zahlen.
        </p>
        
        <div className="mb-4 bg-yellow-50 border border-yellow-300 rounded p-3">
          <p className="font-semibold mb-2 text-yellow-900">⚠️ Wichtig zu verstehen:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800">
            <li><strong>Sonderausgaben:</strong> Versicherungen reduzieren Ihr zu versteuerndes Einkommen</li>
            <li><strong>Steuerersparnis:</strong> Bei 550 € Versicherung sparen Sie ca. 180-190 € Steuern (bei ~35% Steuersatz)</li>
            <li><strong>Echte Kosten:</strong> Die vollen 550 € werden aber trotzdem von Ihrem Netto abgezogen!</li>
            <li><strong>Netto-Effekt:</strong> Sie zahlen real ca. 360-370 € aus eigener Tasche (550 € - Steuerersparnis)</li>
          </ul>
        </div>
        
        <div className="mb-4">
          <p className="font-semibold mb-2">🏥 Absetzbare Versicherungen:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm mb-2">
            <li><strong>Krankenversicherung:</strong> Private Zusatzversicherungen</li>
            <li><strong>Unfallversicherung:</strong> Private Unfallversicherungen</li>
            <li><strong>Lebensversicherung:</strong> Kapitalbildende Lebensversicherungen (begrenzt)</li>
            <li><strong>Berufsunfähigkeitsversicherung</strong></li>
            <li><strong>Pensionsversicherung:</strong> Private Pensionsvorsorge</li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">💡 Wichtige Hinweise:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Geben Sie den <strong>monatlichen Betrag</strong> an</li>
            <li>Nicht alle Versicherungsbeiträge sind in voller Höhe absetzbar</li>
            <li>Die Schweizer Sozialversicherungsbeiträge (AHV, BVG etc.) werden bereits oben automatisch berechnet</li>
            <li>Österreichische Sozialversicherung entfällt meist für Grenzgänger in die Schweiz</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-sm font-semibold text-blue-900 mb-1">📋 Beispiele:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Private Krankenversicherung: €80-150/Monat</li>
            <li>• Lebensversicherung: €50-200/Monat</li>
            <li>• Unfallversicherung: €20-50/Monat</li>
          </ul>
        </div>

        <p className="text-sm text-slate-600 mt-3">
          💡 Konsultieren Sie einen Steuerberater für die genaue steuerliche Behandlung Ihrer Versicherungsbeiträge.
        </p>
      </>
    ),
  },

  ahvRate: {
    title: 'AHV-Beitragssatz (Schweiz)',
    content: (
      <>
        <p className="mb-3">
          Die <strong>AHV (Alters- und Hinterlassenenversicherung)</strong> ist die obligatorische
          Schweizer Rentenversicherung.
        </p>
        
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-3">
          <p className="font-semibold mb-2 text-blue-900">📊 Standardsatz 2026:</p>
          <p className="text-sm text-blue-800">
            <strong>5.3%</strong> des Bruttolohns (inkl. IV/EO)
          </p>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">Was ist enthalten:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>AHV:</strong> Alters- und Hinterlassenenversicherung (4.35%)</li>
            <li><strong>IV:</strong> Invalidenversicherung (0.7%)</li>
            <li><strong>EO:</strong> Erwerbsersatzordnung (0.25%)</li>
          </ul>
        </div>

        <p className="text-sm text-slate-600">
          💡 Dieser Wert ist normalerweise fix. Ändern Sie ihn nur, wenn Ihr Arbeitgeber
          einen abweichenden Satz anwendet.
        </p>
      </>
    ),
  },

  alvRate: {
    title: 'ALV-Beitragssatz (Schweiz)',
    content: (
      <>
        <p className="mb-3">
          Die <strong>ALV (Arbeitslosenversicherung)</strong> ist die obligatorische
          Schweizer Arbeitslosenversicherung.
        </p>
        
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-3">
          <p className="font-semibold mb-2 text-blue-900">📊 Standardsatz 2026:</p>
          <p className="text-sm text-blue-800">
            <strong>1.1%</strong> des Bruttolohns (bis CHF 148'200/Jahr)
          </p>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">⚠️ Wichtig:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Bis CHF 148'200 Jahreseinkommen: 1.1%</li>
            <li>Über CHF 148'200 Jahreseinkommen: zusätzlich 0.5% auf den übersteigenden Betrag</li>
          </ul>
        </div>

        <p className="text-sm text-slate-600">
          💡 Die App berechnet automatisch den erhöhten Satz für hohe Einkommen.
        </p>
      </>
    ),
  },

  bvgRate: {
    title: 'BVG-Beitragssatz (Schweiz)',
    content: (
      <>
        <p className="mb-3">
          Die <strong>BVG (Berufliche Vorsorge)</strong> ist die obligatorische
          Schweizer Pensionskasse (2. Säule).
        </p>
        
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-3">
          <p className="font-semibold mb-2 text-blue-900">📊 Standardsatz 2026:</p>
          <p className="text-sm text-blue-800">
            <strong>7.0%</strong> des Bruttolohns (Durchschnittswert)
          </p>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">⚠️ Wichtig zu wissen:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Gilt erst ab <strong>18 Jahren</strong></li>
            <li>Mindestjahreseinkommen: CHF 22'050</li>
            <li>Der Satz variiert je nach Pensionskasse (5-15%)</li>
            <li>Steigt mit dem Alter (25, 35, 45, 55 Jahre)</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <p className="text-sm font-semibold text-yellow-900 mb-1">💡 Tipp:</p>
          <p className="text-sm text-yellow-800">
            Schauen Sie auf Ihre Lohnabrechnung für den exakten BVG-Satz Ihrer Pensionskasse.
            Dieser kann zwischen 5% und 15% liegen.
          </p>
        </div>
      </>
    ),
  },

  ktgRate: {
    title: 'KTG-Beitragssatz (Schweiz)',
    content: (
      <>
        <p className="mb-3">
          Die <strong>KTG (Krankentaggeldversicherung)</strong> sichert Sie bei längerer
          Krankheit ab.
        </p>
        
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-3">
          <p className="font-semibold mb-2 text-blue-900">📊 Standardsatz 2026:</p>
          <p className="text-sm text-blue-800">
            <strong>1.4%</strong> des Bruttolohns (Durchschnittswert)
          </p>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">Was wird abgedeckt:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Lohnfortzahlung bei Krankheit (meist 80% des Lohns)</li>
            <li>Wartefrist: typisch 2-3 Tage</li>
            <li>Dauer: bis zu 720 Tage</li>
          </ul>
        </div>

        <p className="text-sm text-slate-600">
          💡 Der Satz variiert je nach Arbeitgeber und Versicherung (0.5-2%).
        </p>
      </>
    ),
  },

  nbuRate: {
    title: 'NBU-Beitragssatz (Schweiz)',
    content: (
      <>
        <p className="mb-3">
          Die <strong>NBU (Nichtberufsunfallversicherung)</strong> deckt Unfälle außerhalb
          der Arbeitszeit ab.
        </p>
        
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-3">
          <p className="font-semibold mb-2 text-blue-900">📊 Standardsatz 2026:</p>
          <p className="text-sm text-blue-800">
            <strong>1.0%</strong> des Bruttolohns (Durchschnittswert)
          </p>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">Was wird abgedeckt:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Unfälle in der Freizeit</li>
            <li>Sport- und Freizeitunfälle</li>
            <li>Verkehrsunfälle außerhalb der Arbeit</li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">⚠️ Wichtig:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Nur bei Arbeitszeit <strong>≥ 8 Stunden/Woche</strong></li>
            <li>Wird vom Arbeitnehmer bezahlt (nicht vom Arbeitgeber)</li>
            <li>Der Satz variiert je nach Risiko (0.5-2%)</li>
          </ul>
        </div>

        <p className="text-sm text-slate-600">
          💡 Prüfen Sie Ihre Lohnabrechnung für den exakten NBU-Satz.
        </p>
      </>
    ),
  },

  manualSourceTax: {
    title: 'Manuelle Quellensteuer-Eingabe',
    content: (
      <>
        <p className="mb-3">
          Mit dieser Option können Sie die <strong>Quellensteuer</strong> manuell eingeben,
          anstatt sie automatisch berechnen zu lassen.
        </p>
        
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-3">
          <p className="font-semibold mb-2 text-blue-900">💡 Wann ist das sinnvoll?</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800">
            <li>Sie haben Ihre Lohnabrechnung und kennen den exakten Betrag</li>
            <li>Ihr Arbeitgeber verwendet spezielle Tarife</li>
            <li>Sie möchten verschiedene Szenarien durchrechnen</li>
            <li>Die automatische Berechnung weicht von Ihrer Realität ab</li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">📋 So finden Sie die Quellensteuer:</p>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>Schauen Sie auf Ihre monatliche Lohnabrechnung</li>
            <li>Suchen Sie nach "Quellensteuer" oder "Steuerabzug"</li>
            <li>Der Betrag ist in CHF angegeben</li>
            <li>Geben Sie den monatlichen Betrag hier ein</li>
          </ol>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">⚙️ Automatische Berechnung:</p>
          <p className="text-sm mb-2">
            Wenn diese Option <strong>deaktiviert</strong> ist, berechnet die App die Quellensteuer
            automatisch basierend auf:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Ihrem Bruttolohn</li>
            <li>Ihrem Familienstand (ledig/verheiratet)</li>
            <li>Der Anzahl Ihrer Kinder</li>
            <li>Den offiziellen Tarifen des Kantons St. Gallen</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
          <p className="text-sm font-semibold text-yellow-900 mb-1">⚠️ Wichtig:</p>
          <p className="text-sm text-yellow-800">
            Die manuelle Eingabe überschreibt die automatische Berechnung komplett.
            Familienstand und Kinder werden dann für die Quellensteuer ignoriert
            (aber weiterhin für die österreichische Steuer verwendet).
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded p-3">
          <p className="text-sm font-semibold text-green-900 mb-1">💰 Beispielwerte:</p>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• CHF 6'000 Brutto, ledig, keine Kinder: ca. CHF 450-550</li>
            <li>• CHF 6'000 Brutto, verheiratet, 2 Kinder: ca. CHF 250-350</li>
            <li>• CHF 8'000 Brutto, ledig, keine Kinder: ca. CHF 700-850</li>
          </ul>
        </div>

        <p className="text-sm text-slate-600 mt-3">
          💡 Tipp: Vergleichen Sie die automatische Berechnung mit Ihrer Lohnabrechnung.
          Bei größeren Abweichungen verwenden Sie die manuelle Eingabe.
        </p>
      </>
    ),
  },
};
