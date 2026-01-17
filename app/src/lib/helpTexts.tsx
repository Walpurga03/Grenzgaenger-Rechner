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
          Der aktuelle <strong>Wechselkurs</strong> für die Umrechnung von Schweizer Franken in Euro.
        </p>
        <p className="mb-3">
          <strong>Beispiel:</strong> Bei einem Kurs von 0.95 erhalten Sie für 1 CHF etwa 0.95 EUR.
        </p>
        <p className="mb-3">
          <strong>Wo finde ich den aktuellen Kurs?</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>Europäische Zentralbank (EZB)</li>
          <li>Ihre Bank oder Online-Banking</li>
          <li>Finanznachrichten-Portale</li>
        </ul>
        <p className="text-sm text-slate-600">
          💡 Der Kurs schwankt täglich. Verwenden Sie einen Durchschnittswert für Planungen.
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
          <strong>Auswirkungen:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li><strong>Schweiz:</strong> Niedrigere Quellensteuer (~0.5% pro Kind)</li>
          <li><strong>Österreich:</strong> Familienbonus Plus (siehe unten)</li>
        </ul>
        <p className="text-sm text-slate-600">
          💡 Kinderabzüge gelten in der Regel für Kinder unter 18 Jahren bzw. in Ausbildung.
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
        <p className="mb-3">
          <strong>Höhe abhängig von:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>Entfernung zwischen Wohnort und Arbeitsort</li>
          <li>Verfügbarkeit öffentlicher Verkehrsmittel</li>
          <li>Kleines vs. Großes Pendlerpauschale</li>
        </ul>
        <p className="text-sm bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
          <strong>Typische Werte:</strong><br />
          • Unter 20 km: €0 - €60<br />
          • 20-40 km: €150 - €200<br />
          • Über 60 km: €300+
        </p>
        <p className="text-sm text-slate-600">
          💡 Nutzen Sie den Pendlerrechner auf finanzonline.at für Ihren exakten Betrag.
        </p>
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

  pensionerBonus: {
    title: 'Pensionistenabsetzbetrag (AT)',
    content: (
      <>
        <p className="mb-3">
          Der <strong>Pensionistenabsetzbetrag</strong> steht Pensionisten und Rentnern in Österreich zu.
        </p>
        <p className="mb-3">
          <strong>Wer kann ihn geltend machen?</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>Bezieher einer österreichischen Pension</li>
          <li>Grenzgänger, die bereits in Pension sind</li>
          <li>Einkommensabhängig (max. €825 jährlich)</li>
        </ul>
        <p className="text-sm text-slate-600">
          💡 Für aktive Arbeitnehmer in der Regel €0.
        </p>
      </>
    ),
  },
};
