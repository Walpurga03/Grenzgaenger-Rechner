import { AlertCircle, Briefcase, HandCoins, Heart, Lightbulb, FileText, Clock } from 'lucide-react';

export function TaxTips() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Steuerlast effektiv senken
        </h1>
        <p className="text-lg text-slate-600">
          Als Grenzgänger haben Sie zahlreiche Möglichkeiten, Ihre Nachzahlung in Österreich zu reduzieren.
          Hier ist eine umfassende Übersicht aller absetzbaren Posten.
        </p>
      </div>

      {/* Zulagen und Schichtarbeit */}
      <section className="mb-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">1. Zulagen, Schichtarbeit und steuerfreie Bezüge</h2>
            <p className="text-sm text-slate-600">Spezielle Begünstigungen für erschwerte Arbeitsbedingungen</p>
          </div>
        </div>

        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-slate-700">
            <strong>Wichtig für Grenzgänger:</strong> Die Schweiz besteuert diese Zulagen oft normal, 
            Österreich stellt sie jedoch unter bestimmten Bedingungen steuerfrei.
          </p>
        </div>
        
        <div className="space-y-4 mt-6">
          <div className="pl-4 border-l-4 border-orange-500">
            <h3 className="font-semibold text-slate-900 mb-1">SEG-Zulagen (Schmutz, Erschwernis, Gefahr)</h3>
            <p className="text-slate-600 text-sm">
              Wenn Ihre Arbeit nachweislich schmutzig, besonders anstrengend oder gefährlich ist, sind diese 
              Zulagen bis zu einem gewissen Freibetrag in Österreich steuerfrei.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-orange-400">
            <h3 className="font-semibold text-slate-900 mb-1">Sonn-, Feiertags- und Nachtzuschläge (SFN)</h3>
            <p className="text-slate-600 text-sm">
              Zuschläge für Arbeit zu diesen Zeiten sind bis zu einem monatlichen Höchstbetrag 
              (aktuell ca. <strong>360 €</strong> bzw. bei extremer Nachtarbeit bis zu <strong>540 €</strong>) steuerfrei.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-orange-400">
            <h3 className="font-semibold text-slate-900 mb-1">Überstundenzuschläge</h3>
            <p className="text-slate-600 text-sm">
              Für die ersten 10 Überstunden im Monat ist der Zuschlag (maximal 50%) bis zu einem Betrag von 
              <strong> 86 €</strong> (bzw. befristet <strong>200 €</strong> in den Jahren 2024/25) steuerfrei.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-orange-400">
            <h3 className="font-semibold text-slate-900 mb-1">⚠️ Schichtzulage vs. Schichtzuschlag</h3>
            <p className="text-slate-600 text-sm mb-2">
              <strong>Wichtige Unterscheidung:</strong>
            </p>
            <p className="text-slate-600 text-sm mb-1">
              • Eine reine <strong>Schichtzulage</strong> (nur weil man im Schichtmodell arbeitet) ist in Österreich 
              oft <strong>normal steuerpflichtig</strong>.
            </p>
            <p className="text-slate-600 text-sm mb-2">
              • <strong>Zuschläge</strong> für Nacht-, Sonn- oder Feiertagsstunden sind hingegen <strong>begünstigt</strong>.
            </p>
            <p className="text-slate-600 text-sm">
              <strong>Tipp:</strong> Achten Sie darauf, dass auf dem Schweizer Lohnzettel die Stunden für die 
              Nachtarbeit oder die Erschwernis <strong>getrennt ausgewiesen</strong> sind. Das österreichische 
              Finanzamt braucht diesen Nachweis, um die Steuerfreiheit zu gewähren.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-orange-500 bg-orange-50 p-3 rounded">
            <h3 className="font-semibold text-slate-900 mb-1">💡 Wichtiger Tipp für Grenzgänger</h3>
            <p className="text-slate-600 text-sm">
              Damit das österreichische Finanzamt diese Zulagen steuerfrei stellt, müssen sie im Schweizer 
              Arbeitsvertrag oder in der Lohnabrechnung <strong>separat ausgewiesen</strong> sein. 
              Pauschalbeträge ohne Nachweis der Stunden werden oft nicht anerkannt.
            </p>
          </div>
        </div>
      </section>

      {/* Werbungskosten */}
      <section className="mb-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">2. Werbungskosten</h2>
            <p className="text-sm text-slate-600">Berufsbedingte Ausgaben – mindern die Bemessungsgrundlage</p>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <div className="pl-4 border-l-4 border-blue-500">
            <h3 className="font-semibold text-slate-900 mb-1">Fahrtkosten</h3>
            <p className="text-slate-600 text-sm mb-2">
              <strong>• Pendlerpauschale:</strong> Minderung der Steuerbasis bei langem Arbeitsweg oder 
              Unzumutbarkeit von öffentlichen Verkehrsmitteln (Große Pendlerpauschale).
            </p>
            <p className="text-slate-600 text-sm">
              <strong>• Pendlereuro:</strong> Direkter Abzug von der Steuerschuld (Entfernung × 2 EUR pro Jahr).
            </p>
          </div>

          <div className="pl-4 border-l-4 border-blue-400">
            <h3 className="font-semibold text-slate-900 mb-1">Arbeitsmittel</h3>
            <p className="text-slate-600 text-sm">
              Computer, Internetkosten (anteilig), Software, Werkzeug, Fachliteratur.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-blue-400">
            <h3 className="font-semibold text-slate-900 mb-1">Home-Office</h3>
            <p className="text-slate-600 text-sm">
              Monatliche Pauschale pro Tag im Home-Office plus ergonomische Möbel (bis zu <strong>3,00 € pro Tag</strong>, 
              max. 300,00 € im Jahr, plus Mobiliar bis 300,00 € bei mindestens 26 Tagen).
            </p>
          </div>

          <div className="pl-4 border-l-4 border-blue-400">
            <h3 className="font-semibold text-slate-900 mb-1">Berufskleidung</h3>
            <p className="text-slate-600 text-sm">
              Nur bei typischer Arbeitskleidung (Uniformen, Blaumann, Sicherheitsschuhe). 
              Normale Anzüge zählen meist nicht.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-blue-400">
            <h3 className="font-semibold text-slate-900 mb-1">Fortbildung & Fachliteratur</h3>
            <p className="text-slate-600 text-sm">
              Kurse, Prüfungsgebühren, Reisekosten zu Bildungseinrichtungen, Lernmaterial für 
              Ihren aktuellen oder einen verwandten Beruf.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-blue-400">
            <h3 className="font-semibold text-slate-900 mb-1">Doppelte Haushaltsführung</h3>
            <p className="text-slate-600 text-sm">
              Wenn der Arbeitsort so weit vom Wohnort entfernt ist, dass eine tägliche Rückreise unzumutbar ist 
              (Kosten für Zweitwohnsitz und Familienheimfahrten).
            </p>
          </div>

          <div className="pl-4 border-l-4 border-blue-400">
            <h3 className="font-semibold text-slate-900 mb-1">Reisekosten</h3>
            <p className="text-slate-600 text-sm">
              Tagesgelder und Nächtigungsgelder bei Dienstreisen. Falls Sie beruflich unterwegs sind und 
              vom Schweizer Arbeitgeber nicht das volle österreichische Kilometergeld (<strong>0,42 €/km</strong>) 
              oder Tagesgelder erhalten, können Sie die Differenz steuerlich geltend machen.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
            <h3 className="font-semibold text-slate-900 mb-1">💡 Werbungskosten-Pauschale</h3>
            <p className="text-slate-600 text-sm">
              Jedem Arbeitnehmer steht automatisch ein Pauschbetrag von <strong>132 € pro Jahr</strong> zu. 
              Liegen Ihre tatsächlichen Kosten (Laptop, Fahrten etc.) darüber, geben Sie die echten Kosten an.
            </p>
          </div>
        </div>
      </section>

      {/* Sonderausgaben */}
      <section className="mb-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">3. Sonderausgaben</h2>
            <p className="text-sm text-slate-600">Private Ausgaben mit staatlicher Förderung</p>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <div className="pl-4 border-l-4 border-green-500">
            <h3 className="font-semibold text-slate-900 mb-1">Kirchenbeitrag</h3>
            <p className="text-slate-600 text-sm">
              Absetzbar bis zu einem jährlichen Höchstbetrag (derzeit <strong>600 €</strong>).
            </p>
          </div>

          <div className="pl-4 border-l-4 border-green-400">
            <h3 className="font-semibold text-slate-900 mb-1">Spenden</h3>
            <p className="text-slate-600 text-sm">
              An mildtätige Organisationen, Feuerwehren oder Museen.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-green-400">
            <h3 className="font-semibold text-slate-900 mb-1">Steuerberatung</h3>
            <p className="text-slate-600 text-sm">
              Honorare für die Erstellung der Steuererklärung sind <strong>unbegrenzt abzugsfähig</strong>.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-green-400">
            <h3 className="font-semibold text-slate-900 mb-1">Freiwillige Weiterversicherung</h3>
            <p className="text-slate-600 text-sm">
              Beiträge für eine freiwillige Höherversicherung in der gesetzlichen Pensionsversicherung.
            </p>
          </div>
        </div>
      </section>

      {/* Außergewöhnliche Belastungen */}
      <section className="mb-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">4. Außergewöhnliche Belastungen</h2>
            <p className="text-sm text-slate-600">Zwangsläufig erwachsene Kosten mit einkommensabhängigem Selbstbehalt (ca. 6-12%)</p>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <div className="pl-4 border-l-4 border-red-500">
            <h3 className="font-semibold text-slate-900 mb-1">Krankheitskosten</h3>
            <p className="text-slate-600 text-sm">
              Arztkosten, Medikamente, Heilbehelfe (Brillen, Rollstühle), Zahnersatz (Implantate, Brücken), 
              Rezeptgebühren oder hohe Fahrtkosten zu Ärzten, sofern diese nicht von der Versicherung gedeckt sind.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-red-400">
            <h3 className="font-semibold text-slate-900 mb-1">Behinderungen</h3>
            <p className="text-slate-600 text-sm">
              Pauschalbeträge je nach Grad der Behinderung (auch für Kinder/Ehepartner). 
              Falls ein Grad der Behinderung vorliegt, gibt es hohe Pauschalbeträge <strong>ohne Selbstbehalt</strong>.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-red-400">
            <h3 className="font-semibold text-slate-900 mb-1">Pflegekosten</h3>
            <p className="text-slate-600 text-sm">
              Kosten für Pflegepersonal oder Pflegeheim.
            </p>
          </div>
        </div>
      </section>

      {/* Absetzbeträge */}
      <section className="mb-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <HandCoins className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">5. Absetzbeträge</h2>
            <p className="text-sm text-slate-600">Direktabzug von der bereits berechneten Steuer (nicht von der Basis!)</p>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <div className="pl-4 border-l-4 border-purple-500">
            <h3 className="font-semibold text-slate-900 mb-1">Familienbonus Plus</h3>
            <p className="text-slate-600 text-sm">
              Pro Kind (gestaffelt nach Alter): Kinder unter 18 Jahren: <strong>166,68 € pro Monat</strong> | 
              Kinder über 18 (zuhause, in Ausbildung): <strong>54,18 € pro Monat</strong>, solange Familienbeihilfe bezogen wird.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-purple-400">
            <h3 className="font-semibold text-slate-900 mb-1">Alleinverdiener- / Alleinerzieherabsetzbetrag</h3>
            <p className="text-slate-600 text-sm">
              Wenn der Partner wenig oder gar nichts verdient (weniger als <strong>6.937,00 € pro Jahr</strong>), 
              steht Ihnen dieser Betrag zu (da Sie mindestens ein Kind haben, für das Sie Familienbeihilfe beziehen). 
              Mit 1 Kind: EUR 572/Jahr, jedes weitere Kind: +EUR 206/Jahr.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-purple-400">
            <h3 className="font-semibold text-slate-900 mb-1">Unterhaltsabsetzbetrag</h3>
            <p className="text-slate-600 text-sm">
              Wenn gesetzlicher Unterhalt für Kinder gezahlt wird, die nicht im selben Haushalt leben.
            </p>
          </div>

          <div className="pl-4 border-l-4 border-purple-400">
            <h3 className="font-semibold text-slate-900 mb-1">Mehrkindzuschlag</h3>
            <p className="text-slate-600 text-sm">
              Ab dem dritten Kind (falls zutreffend).
            </p>
          </div>
        </div>
      </section>

      {/* Besonderheit: Progressionsvorbehalt */}
      <section className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-sm border border-yellow-300 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-yellow-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Progressionsvorbehalt bei Sonderzahlungen</h2>
            <p className="text-sm text-slate-600">Wichtig zu verstehen: Wie 13./14. Gehalt Ihre Steuerrate beeinflusst</p>
          </div>
        </div>
        
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-sm text-slate-800 mb-2">
            <strong>⚠️ Das klingt komplex, ist aber wichtig zu verstehen:</strong>
          </p>
          <p className="text-sm text-slate-700">
            In Österreich werden 13. und 14. Gehalt mit nur 6% besteuert (ab 620 € Freibetrag). Das ist sehr günstig! 
            ABER: Diese Sonderzahlungen erhöhen trotzdem Ihren Steuersatz für Ihr reguläres Gehalt (12 Monate).
          </p>
        </div>
        
        <div className="space-y-4 mt-6">
          <div className="p-4 bg-white rounded-lg border border-yellow-300">
            <h3 className="font-semibold text-slate-900 mb-2">Was bedeutet das konkret?</h3>
            <p className="text-slate-600 text-sm mb-2">
              Das Finanzamt berechnet zunächst einen <strong>fiktiven Steuersatz</strong>, als ob Sie Ihr gesamtes 
              Jahreseinkommen (also 14 Monate) normal versteuern würden. Dieser höhere Steuersatz wird dann auf 
              Ihr reguläres Gehalt (12 Monate) angewendet.
            </p>
            <p className="text-slate-600 text-sm">
              Das 13. und 14. Gehalt selbst wird trotzdem nur mit 6% besteuert. Es geht NUR um den Effekt auf 
              die 12 Monatsgehälter.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-yellow-300">
            <h3 className="font-semibold text-slate-900 mb-2">Beispielrechnung:</h3>
            <div className="text-slate-600 text-sm space-y-2">
              <p>
                <strong>Ohne 13./14. Gehalt:</strong><br/>
                • 12 × 6.000 CHF = 72.000 CHF/Jahr<br/>
                • Steuersatz bei 72.000 CHF: ca. 30%<br/>
                • Steuer: 72.000 × 30% = 21.600 CHF
              </p>
              <p>
                <strong>Mit 13./14. Gehalt (Progressionsvorbehalt):</strong><br/>
                • 14 × 6.000 CHF = 84.000 CHF/Jahr<br/>
                • Fiktiver Steuersatz bei 84.000 CHF: ca. 35% (höher wegen Progression!)<br/>
                • Steuer auf 12 Monate: 72.000 × 35% = 25.200 CHF<br/>
                • Steuer auf 13./14.: (12.000 - 1.240 Freibetrag) × 6% = 645 CHF<br/>
                • <strong>Gesamtsteuer: 25.845 CHF</strong>
              </p>
              <p className="pt-2 border-t border-yellow-200">
                <strong>Vorteil trotzdem:</strong> Würde man die 84.000 CHF komplett mit 35% versteuern, 
                wären es 29.400 CHF. Durch die Begünstigung sparen Sie also ca. 3.555 CHF!
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-yellow-300">
            <h3 className="font-semibold text-slate-900 mb-2">Warum ist das System trotzdem vorteilhaft?</h3>
            <p className="text-slate-600 text-sm mb-2">
              Auch wenn die 12 Monatsgehälter durch den Progressionsvorbehalt etwas höher besteuert werden, 
              bleibt der Gesamteffekt <strong>stark positiv</strong>:
            </p>
            <ul className="text-slate-600 text-sm space-y-1 list-disc list-inside">
              <li>Das 13./14. Gehalt wird nur mit 6% statt mit 30-50% besteuert</li>
              <li>Die Ersparnis auf den Sonderzahlungen ist deutlich größer als der Mehraufwand auf die 12 Monate</li>
              <li>Unterm Strich zahlen Sie weniger Steuern als bei einer einheitlichen Besteuerung aller 14 Monate</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-300">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              ✅ Fazit
            </h3>
            <p className="text-green-800 text-sm">
              Der Progressionsvorbehalt ist eine <strong>technische Berechnungsmethode</strong>, die sicherstellt, 
              dass höhere Einkommen nicht unfair von der 6%-Regelung profitieren. Für Sie als Grenzgänger bedeutet 
              es: Sie zahlen auf die Sonderzahlungen nur 6% Steuer, aber Ihr reguläres Gehalt wird etwas höher 
              besteuert, als wenn es keine Sonderzahlungen gäbe. <strong>Der Nettoeffekt bleibt aber positiv!</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Profi-Tipps */}
      <section className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-sm border border-indigo-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Lightbulb className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Profi-Tipps zur Steuersenkung</h2>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <div className="p-4 bg-white rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Lohnbestätigung präzisieren
            </h3>
            <p className="text-slate-600 text-sm">
              Bitten Sie Ihren Schweizer Arbeitgeber, Schichtzulagen und Nachtarbeit auf der monatlichen 
              Abrechnung exakt auszuweisen. Nur so kann das österreichische Finanzamt die Steuerbefreiung anwenden.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Krankenversicherung prüfen
            </h3>
            <p className="text-slate-600 text-sm">
              Bei Grenzgängern werden die Beiträge zur Krankenversicherung oft als Pflichtbeiträge gewertet. 
              Diese können das zu versteuernde Einkommen <strong>massiv senken</strong>.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Werbungskosten-Pauschale vs. echte Kosten
            </h3>
            <p className="text-slate-600 text-sm">
              Jedem Arbeitnehmer steht automatisch ein Pauschbetrag von <strong>132 € pro Jahr</strong> zu. 
              Liegen Ihre tatsächlichen Kosten (Laptop, Fahrten etc.) darüber, geben Sie die echten Kosten an.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              Veranlagung auch bei Null-Aussicht
            </h3>
            <p className="text-slate-600 text-sm">
              Auch wenn Sie glauben, nichts zurückzubekommen, lohnt sich die Abgabe der Steuererklärung oft, 
              um Verluste oder Sonderausgaben für die Folgejahre festzuhalten.
            </p>
          </div>
        </div>
      </section>

      {/* Wichtiger Hinweis */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Wichtiger Hinweis</h3>
            <p className="text-slate-700 mb-3">
              Sammeln Sie konsequent alle Belege in einem Ordner (digital oder physisch). In Österreich können Sie 
              viele dieser Posten einfach in der <strong>"Arbeitnehmerveranlagung"</strong> (L1i Formular für Grenzgänger) 
              über <strong>FinanzOnline</strong> angeben.
            </p>
            <p className="text-slate-700">
              Bei einem Bruttoeinkommen in dieser Höhe macht eine <strong>professionelle Steuerberatung</strong> im 
              ersten Jahr meistens Sinn, da die Kosten für den Berater im Folgejahr selbst wieder die Steuer senken.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
