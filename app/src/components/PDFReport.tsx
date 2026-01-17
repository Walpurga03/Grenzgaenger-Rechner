import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { type GrenzgaengerResult } from '@/lib/calculator';

interface PDFReportProps {
  result: GrenzgaengerResult;
  inputData: {
    grossSalaryCHF: number;
    salaryMonths: 12 | 13 | 14;
    age: number;
    maritalStatus: 'single' | 'married';
    childrenCount: number;
    commuterDistanceKm: number;
    commuterAllowanceEUR: number;
    soleEarnerBonusEUR: number;   // Alleinverdienerabsetzbetrag
    insuranceContributionEUR: number;
    exchangeRate: number;
  };
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #3b82f6',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 3,
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
    borderBottom: '1 solid #e2e8f0',
    paddingBottom: 4,
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e2e8f0',
    paddingVertical: 6,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    fontWeight: 'bold',
    borderBottom: '2 solid #cbd5e1',
  },
  tableCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  tableColRight: {
    flex: 1,
    paddingHorizontal: 8,
    textAlign: 'right',
  },
  summaryBox: {
    backgroundColor: '#f0fdf4',
    border: '2 solid #22c55e',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#15803d',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#64748b',
    borderTop: '1 solid #e2e8f0',
    paddingTop: 10,
  },
  disclaimer: {
    fontSize: 8,
    color: '#94a3b8',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    width: '40%',
    color: '#64748b',
  },
  infoValue: {
    width: '60%',
    fontWeight: 'bold',
    color: '#1e293b',
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
  },
});

export function PDFReport({ result, inputData }: PDFReportProps) {
  const formatCurrency = (amount: number, currency: 'CHF' | 'EUR') => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const today = new Date().toLocaleDateString('de-CH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      {/* SEITE 1: Übersicht und Berechnung */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Grenzgänger Steuerberechnung</Text>
          <Text style={styles.subtitle}>St. Gallen (CH) ↔ Österreich (AT)</Text>
          <Text style={styles.subtitle}>Erstellt am {today}</Text>
        </View>

        {/* Eingabedaten */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ihre Eingabedaten</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bruttolohn (CHF):</Text>
            <Text style={styles.infoValue}>{formatCurrency(inputData.grossSalaryCHF, 'CHF')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gehälter pro Jahr:</Text>
            <Text style={styles.infoValue}>{inputData.salaryMonths}×</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Wechselkurs:</Text>
            <Text style={styles.infoValue}>{inputData.exchangeRate.toFixed(4)} CHF/EUR</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Alter:</Text>
            <Text style={styles.infoValue}>{inputData.age} Jahre</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Familienstand:</Text>
            <Text style={styles.infoValue}>{inputData.maritalStatus === 'single' ? 'Ledig' : 'Verheiratet'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kinder:</Text>
            <Text style={styles.infoValue}>{inputData.childrenCount}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pendelstrecke:</Text>
            <Text style={styles.infoValue}>{inputData.commuterDistanceKm} km</Text>
          </View>
        </View>

        {/* Berechnungsübersicht */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Berechnungsübersicht</Text>
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <Text style={styles.tableCol}>Position</Text>
              <Text style={styles.tableColRight}>Betrag (EUR)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>Bruttolohn</Text>
              <Text style={styles.tableColRight}>{formatCurrency(result.grossSalaryEUR, 'EUR')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>AHV/ALV</Text>
              <Text style={styles.tableColRight}>- {formatCurrency(result.breakdown.ahvALV, 'EUR')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>BVG (Pensionskasse)</Text>
              <Text style={styles.tableColRight}>- {formatCurrency(result.breakdown.bvg, 'EUR')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>KTG/NBU</Text>
              <Text style={styles.tableColRight}>- {formatCurrency(result.breakdown.ktgNBU, 'EUR')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>Quellensteuer St. Gallen (4,5%)</Text>
              <Text style={styles.tableColRight}>- {formatCurrency(result.breakdown.sourceTaxSG, 'EUR')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>Versicherungsbeitrag (AT)</Text>
              <Text style={styles.tableColRight}>- {formatCurrency(result.breakdown.insuranceContribution, 'EUR')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>Österreichische Einkommensteuer (inkl. DBA-Anrechnung)</Text>
              <Text style={styles.tableColRight}>- {formatCurrency(result.breakdown.austrianTax, 'EUR')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>Familienbonus Plus</Text>
              <Text style={styles.tableColRight}>+ {formatCurrency(result.breakdown.familyBonus, 'EUR')}</Text>
            </View>
          </View>
        </View>

        {/* Endergebnis */}
        <View style={styles.summaryBox} wrap={false}>
          <Text style={styles.summaryTitle}>Monatliches Nettoeinkommen (Österreich-Standard: 14 Gehälter)</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(result.finalNetEURAustrianComparison, 'EUR')}</Text>
          <Text style={{ fontSize: 10, color: '#166534', textAlign: 'center', marginTop: 5 }}>
            Vergleichswert bei 12 Gehältern: {formatCurrency(result.finalNetEUR, 'EUR')}
          </Text>
          <Text style={{ fontSize: 8, color: '#15803d', textAlign: 'center', marginTop: 3, fontStyle: 'italic' }}>
            Hinweis: In Österreich werden Gehälter meist auf 14 Monate verteilt (12 + Urlaubs- & Weihnachtsgeld)
          </Text>
        </View>

        {/* Zusätzliche Informationen */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Steuerstatistik</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Effektive Steuerlast:</Text>
            <Text style={styles.infoValue}>{result.effectiveTaxRate.toFixed(2)}%</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gesamt-Abzüge (jährlich):</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(result.totalTaxBurden * 12, 'EUR')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Netto-Jahresgehalt:</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(result.finalNetEUR * 12, 'EUR')}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Grenzgänger-Rechner | St. Gallen (CH) ↔ Österreich (AT)</Text>
          <Text>Erstellt am {today} | Seite 1 von 2</Text>
        </View>
      </Page>

      {/* SEITE 2: Erläuterungen und Hinweise */}
      <Page size="A4" style={styles.page}>
        {/* Header Seite 2 */}
        <View style={styles.header}>
          <Text style={styles.title}>Wichtige Erläuterungen</Text>
          <Text style={styles.subtitle}>Grenzgänger St. Gallen (CH) ↔ Österreich (AT)</Text>
        </View>

        {/* Erläuterungen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verständnis der Berechnung</Text>
          <View style={{ marginTop: 8, fontSize: 9, lineHeight: 1.5 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 10 }}>Schweizer Sozialversicherungen:</Text>
            <Text style={{ marginBottom: 10 }}>
              Die schweizerischen Pflichtbeiträge (AHV, ALV, BVG, KTG, NBU) werden vom Bruttolohn 
              abgezogen (Sie zahlen sie). In Österreich sind sie als Werbungskosten/Sonderausgaben 
              steuerlich abzugsfähig - das bedeutet, sie reduzieren Ihr zu versteuerndes Einkommen 
              und damit die Steuerlast. WICHTIG: Sie sind keine Rückerstattung, sondern reduzieren 
              nur die Steuer.
            </Text>
            
            <Text style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 10 }}>Quellensteuer-Anrechnung:</Text>
            <Text style={{ marginBottom: 10 }}>
              Die Schweizer Quellensteuer (4,5%) wird in Österreich NICHT zusätzlich abgezogen, 
              sondern voll auf die österreichische Einkommensteuerschuld angerechnet. Durch das 
              Doppelbesteuerungsabkommen (DBA) zahlen Sie effektiv keine doppelte Steuer. ABER: 
              Der Lohn ist NICHT steuerfrei - Sie müssen in AT die volle Einkommensteuer zahlen!
            </Text>
            
            <Text style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 10 }}>13./14. Gehalt (Sonderzahlungen):</Text>
            <Text style={{ marginBottom: 10 }}>
              In Österreich werden Sonderzahlungen (Urlaubs-/Weihnachtsgeld) begünstigt mit 6% 
              besteuert (auf Beträge über EUR 620 Freibetrag), nicht mit dem progressiven Steuersatz.
            </Text>
            
            <Text style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 10 }}>Familienbonus Plus:</Text>
            <Text style={{ marginBottom: 10 }}>
              Kinder unter 18 Jahren: EUR 166,68/Monat | Kinder über 18 (zuhause, in Ausbildung): 
              EUR 54,18/Monat. Der Bonus wird direkt von der Steuerschuld abgezogen.
            </Text>
            
            <Text style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 10 }}>Pendlereuro:</Text>
            <Text style={{ marginBottom: 10 }}>
              Zusätzlich zur Pendlerpauschale können Sie den Pendlereuro geltend machen. 
              Berechnung: Entfernung in km × 2 EUR pro Jahr (monatlich: Entfernung × 2 / 12). 
              Wird direkt von der Steuerschuld abgezogen.
            </Text>
            
            {inputData.soleEarnerBonusEUR > 0 && (
              <>
                <Text style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 10 }}>Alleinverdienerabsetzbetrag:</Text>
                <Text style={{ marginBottom: 10 }}>
                  Steht zu, wenn Sie mindestens 1 Kind haben und Ihr(e) Partner/in weniger als 
                  EUR 6.937/Jahr verdient. Mit 1 Kind: EUR 572/Jahr, jedes weitere Kind: +EUR 206/Jahr. 
                  Wird direkt von der Steuerschuld abgezogen.
                </Text>
              </>
            )}
            
            <Text style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 10 }}>Progressionsvorbehalt:</Text>
            <Text style={{ marginBottom: 10 }}>
              Österreich ermittelt den Steuersatz unter Berücksichtigung des weltweiten Einkommens, 
              besteuert aber nur die in Österreich steuerpflichtigen Einkünfte.
            </Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>Wichtiger Hinweis:</Text>
          <Text>
            Diese Berechnung dient ausschließlich zu Informationszwecken und stellt keine Steuerberatung dar. 
            Alle Angaben sind ohne Gewähr. Für verbindliche Auskünfte wenden Sie sich bitte an einen 
            Steuerberater oder die zuständigen Finanzbehörden. Die tatsächliche Steuerlast kann je nach 
            individueller Situation abweichen.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Grenzgänger-Rechner | St. Gallen (CH) ↔ Österreich (AT)</Text>
          <Text>Erstellt am {today} | Seite 2 von 2</Text>
        </View>
      </Page>
    </Document>
  );
}
