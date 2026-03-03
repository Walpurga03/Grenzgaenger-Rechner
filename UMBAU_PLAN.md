# Umbau-Plan: Grenzgänger-Rechner nach Masterplan

## 🔍 Analyse-Ergebnisse

### Identifizierte Abweichungen vom Masterplan

#### ❌ KRITISCH: 4,5%-Kappung fehlt komplett

**Problem**: Die aktuelle Implementierung in [`austrian-tax.ts`](app/src/lib/austrian-tax.ts:118) rechnet die **gesamte** Schweizer Quellensteuer an:

```typescript
// Zeile 117-118 (FALSCH!)
const yearlySwissSourceTax = swissSourceTaxEUR * 12;
const taxAfterSwissCredit = Math.max(0, taxAfterBonuses - yearlySwissSourceTax);
```

**Laut DBA (Art. 15 Abs. 4)**: Nur maximal **4,5% des Bruttolohns** sind anrechenbar!

**Beispiel (Lohnabrechnung Moik)**:
- Quellensteuer CH: 369,25 CHF (5,83%)
- Aktuell angerechnet: 369,25 CHF × 1,04 = 384,02 EUR ❌
- Korrekt anrechenbar: 285,02 CHF × 1,04 = 296,42 EUR ✅
- **Verlust**: 87,60 EUR/Monat = 1.051,20 EUR/Jahr

#### ❌ Fehlende Felder im Result-Interface

Das [`GrenzgaengerResult`](app/src/lib/calculator.ts:34-68) Interface fehlen:
- `creditableSourceTaxEUR` - Anrechenbare Quellensteuer (max. 4,5%)
- `nonCreditableSourceTaxEUR` - Nicht anrechenbare Steuer ("Steuer-Leakage")
- `taxLeakagePercent` - Verlust in Prozent

#### ❌ PDF-Report ohne Kennzahlen

Der [`PDFReport`](app/src/components/PDFReport.tsx) enthält keine:
- Kennzahl 701 (Bruttobezüge)
- Kennzahl 721 (SV-Beiträge)
- Kennzahl 377 (Anrechenbare Steuer)
- Kennzahl 374 (Nicht anrechenbare Steuer)
- Kennzahl 770 (Steuerpflichtiges Einkommen)

#### ❌ Keine UI-Warnung zur Steuer-Leakage

Es gibt keine visuelle Warnung für den Nutzer über die nicht anrechenbare Steuer.

---

## 🛠️ Umbau-Schritte

### Schritt 1: Erweiterung der Interfaces ✅ BEREIT

**Datei**: `app/src/lib/calculator.ts`

```typescript
export interface GrenzgaengerResult {
  // ... bestehende Felder ...
  
  // NEU: DBA-Anrechnung (4,5%-Kappung)
  creditableSourceTaxEUR: number;      // Anrechenbare Quellensteuer (max. 4,5%)
  nonCreditableSourceTaxEUR: number;   // Nicht anrechenbare Steuer (Verlust)
  taxLeakagePercent: number;           // Verlust in Prozent vom Brutto
  
  // NEU: Kennzahlen für AT-Steuererklärung
  taxDeclarationData: {
    kennzahl701: number;  // Bruttobezüge (EUR/Jahr)
    kennzahl721: number;  // SV-Beiträge (EUR/Jahr)
    kennzahl377: number;  // Anrechenbare ausländische Steuer (EUR/Jahr)
    kennzahl374: number;  // Nicht anrechenbare Steuer (EUR/Jahr)
    kennzahl770: number;  // Steuerpflichtiges Einkommen (EUR/Jahr)
  };
}
```

---

### Schritt 2: Implementierung der 4,5%-Kappung ✅ BEREIT

**Datei**: `app/src/lib/austrian-tax.ts`

#### 2a) Neue Funktion für DBA-Anrechnung

```typescript
/**
 * Berechnet die anrechenbare Schweizer Quellensteuer nach DBA
 * Art. 15 Abs. 4: Maximal 4,5% des Bruttolohns
 */
export function calculateCreditableSourceTax(
  grossIncomeEUR: number,
  actualSourceTaxEUR: number
): {
  creditable: number;
  nonCreditable: number;
  leakagePercent: number;
} {
  const DBA_MAX_RATE = 0.045; // 4,5% Kappungsgrenze
  
  // Maximale anrechenbare Steuer nach DBA
  const maxCreditableEUR = grossIncomeEUR * DBA_MAX_RATE;
  
  // Tatsächlich anrechenbar (das Minimum)
  const creditableEUR = Math.min(actualSourceTaxEUR, maxCreditableEUR);
  
  // Nicht anrechenbare Steuer ("Steuer-Leakage")
  const nonCreditableEUR = actualSourceTaxEUR - creditableEUR;
  
  // Verlust in Prozent
  const leakagePercent = grossIncomeEUR > 0 
    ? (nonCreditableEUR / grossIncomeEUR) * 100 
    : 0;
  
  return {
    creditable: creditableEUR,
    nonCreditable: nonCreditableEUR,
    leakagePercent,
  };
}
```

#### 2b) Anpassung der `calculateAustrianTax` Funktion

```typescript
// VORHER (Zeile 117-118):
const yearlySwissSourceTax = swissSourceTaxEUR * 12;
const taxAfterSwissCredit = Math.max(0, taxAfterBonuses - yearlySwissSourceTax);

// NACHHER:
const yearlySwissSourceTax = swissSourceTaxEUR * 12;
const yearlyGrossIncome = grossIncomeEUR * 12;

// DBA-Anrechnung mit 4,5%-Kappung
const dbaCredit = calculateCreditableSourceTax(yearlyGrossIncome, yearlySwissSourceTax);
const taxAfterSwissCredit = Math.max(0, taxAfterBonuses - dbaCredit.creditable);
```

#### 2c) Erweiterung des Return-Objekts

```typescript
export interface AustrianTaxResult {
  // ... bestehende Felder ...
  
  // NEU: DBA-Anrechnung
  creditableSourceTax: number;      // Anrechenbare Quellensteuer
  nonCreditableSourceTax: number;   // Nicht anrechenbare Steuer
  taxLeakagePercent: number;        // Verlust in Prozent
}
```

---

### Schritt 3: Aktualisierung der Hauptberechnung ✅ BEREIT

**Datei**: `app/src/lib/calculator.ts`

```typescript
// Nach Zeile 149 einfügen:

// ========================================
// DBA-ANRECHNUNG (4,5%-KAPPUNG)
// ========================================
const yearlyGrossEUR = convertCHFtoEUR(yearlyGrossCHF, exchangeRate).amountEUR;
const yearlySourceTaxEUR = convertCHFtoEUR(yearlySourceTaxCHF, exchangeRate).amountEUR;

const dbaCredit = calculateCreditableSourceTax(yearlyGrossEUR, yearlySourceTaxEUR);

// Kennzahlen für AT-Steuererklärung
const taxDeclarationData = {
  kennzahl701: yearlyGrossEUR,                           // Bruttobezüge
  kennzahl721: yearlySwissSocialSecurityEUR,             // SV-Beiträge
  kennzahl377: dbaCredit.creditable,                     // Anrechenbare Steuer
  kennzahl374: dbaCredit.nonCreditable,                  // Nicht anrechenbare Steuer
  kennzahl770: yearlyGrossEUR - yearlySwissSocialSecurityEUR, // Steuerpflichtiges Einkommen
};
```

---

### Schritt 4: PDF-Report erweitern ✅ BEREIT

**Datei**: `app/src/components/PDFReport.tsx`

#### 4a) Neue Sektion: Kennzahlen für Steuererklärung

```typescript
<View style={styles.section}>
  <Text style={styles.sectionTitle}>
    Kennzahlen für österreichische Steuererklärung (Formular L1i)
  </Text>
  
  <View style={styles.table}>
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>Kennzahl 701</Text>
      <Text style={styles.tableCell}>Bruttobezüge (EUR/Jahr)</Text>
      <Text style={styles.tableCellRight}>
        {formatCurrency(result.taxDeclarationData.kennzahl701, 'EUR')}
      </Text>
    </View>
    
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>Kennzahl 721</Text>
      <Text style={styles.tableCell}>SV-Beiträge (Werbungskosten)</Text>
      <Text style={styles.tableCellRight}>
        {formatCurrency(result.taxDeclarationData.kennzahl721, 'EUR')}
      </Text>
    </View>
    
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>Kennzahl 377</Text>
      <Text style={styles.tableCell}>Anrechenbare ausländische Steuer</Text>
      <Text style={styles.tableCellRight}>
        {formatCurrency(result.taxDeclarationData.kennzahl377, 'EUR')}
      </Text>
    </View>
    
    <View style={[styles.tableRow, styles.warningRow]}>
      <Text style={styles.tableCell}>Kennzahl 374</Text>
      <Text style={styles.tableCell}>Nicht anrechenbare Steuer (Verlust!)</Text>
      <Text style={[styles.tableCellRight, styles.warningText]}>
        {formatCurrency(result.taxDeclarationData.kennzahl374, 'EUR')}
      </Text>
    </View>
    
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>Kennzahl 770</Text>
      <Text style={styles.tableCell}>Steuerpflichtiges Einkommen</Text>
      <Text style={styles.tableCellRight}>
        {formatCurrency(result.taxDeclarationData.kennzahl770, 'EUR')}
      </Text>
    </View>
  </View>
</View>
```

#### 4b) Neue Sektion: DBA-Anrechnung (4,5%-Kappung)

```typescript
<View style={styles.warningBox}>
  <Text style={styles.warningTitle}>
    ⚠️ Wichtiger Hinweis zur DBA-Anrechnung
  </Text>
  <Text style={styles.warningText}>
    Gemäß Art. 15 Abs. 4 des Doppelbesteuerungsabkommens (DBA) zwischen der 
    Schweiz und Österreich können maximal 4,5% des Bruttolohns als Quellensteuer 
    in Österreich angerechnet werden.
  </Text>
  
  <View style={styles.calculationBox}>
    <Text>Tatsächlich einbehaltene Quellensteuer: {formatCurrency(yearlySourceTaxEUR, 'EUR')}</Text>
    <Text>Anrechenbar (max. 4,5%): {formatCurrency(result.creditableSourceTaxEUR, 'EUR')}</Text>
    <Text style={styles.lossText}>
      Nicht anrechenbar (Verlust): {formatCurrency(result.nonCreditableSourceTaxEUR, 'EUR')} 
      ({result.taxLeakagePercent.toFixed(2)}%)
    </Text>
  </View>
</View>
```

---

### Schritt 5: UI-Komponenten erweitern ✅ BEREIT

**Datei**: `app/src/components/Calculator.tsx`

#### 5a) Neue Info-Card: Steuer-Leakage Warnung

```typescript
{result.nonCreditableSourceTaxEUR > 0 && (
  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
    <div className="flex items-start">
      <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5 mr-3" />
      <div>
        <h3 className="text-sm font-medium text-orange-800">
          Steuer-Leakage: Nicht anrechenbare Quellensteuer
        </h3>
        <p className="mt-2 text-sm text-orange-700">
          Von Ihrer Schweizer Quellensteuer können nur{' '}
          <strong>{formatCurrency(result.creditableSourceTaxEUR / 12, 'EUR')}</strong>{' '}
          pro Monat in Österreich angerechnet werden (4,5% des Bruttolohns).
        </p>
        <p className="mt-1 text-sm text-orange-700">
          Die Differenz von{' '}
          <strong className="text-orange-900">
            {formatCurrency(result.nonCreditableSourceTaxEUR / 12, 'EUR')}
          </strong>{' '}
          pro Monat ({result.taxLeakagePercent.toFixed(2)}%) ist ein unwiederbringlicher Verlust.
        </p>
        <p className="mt-2 text-xs text-orange-600">
          Jährlicher Verlust: {formatCurrency(result.nonCreditableSourceTaxEUR, 'EUR')}
        </p>
      </div>
    </div>
  </div>
)}
```

#### 5b) Erweiterung der Breakdown-Visualisierung

```typescript
<div className="grid grid-cols-2 gap-4 mt-4">
  <div className="bg-blue-50 p-3 rounded">
    <p className="text-xs text-blue-600">Anrechenbare Quellensteuer</p>
    <p className="text-lg font-bold text-blue-900">
      {formatCurrency(result.creditableSourceTaxEUR / 12, 'EUR')}
    </p>
    <p className="text-xs text-blue-500">max. 4,5% des Brutto</p>
  </div>
  
  <div className="bg-red-50 p-3 rounded">
    <p className="text-xs text-red-600">Nicht anrechenbare Steuer</p>
    <p className="text-lg font-bold text-red-900">
      {formatCurrency(result.nonCreditableSourceTaxEUR / 12, 'EUR')}
    </p>
    <p className="text-xs text-red-500">Verlust: {result.taxLeakagePercent.toFixed(2)}%</p>
  </div>
</div>
```

---

### Schritt 6: Neue Visualisierung: Steuer-Leakage Chart ✅ BEREIT

**Neue Datei**: `app/src/components/TaxLeakageChart.tsx`

```typescript
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TaxLeakageChartProps {
  creditableSourceTax: number;
  nonCreditableSourceTax: number;
}

export function TaxLeakageChart({ creditableSourceTax, nonCreditableSourceTax }: TaxLeakageChartProps) {
  const data = [
    { name: 'Anrechenbar (4,5%)', value: creditableSourceTax, color: '#3b82f6' },
    { name: 'Nicht anrechenbar (Verlust)', value: nonCreditableSourceTax, color: '#ef4444' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">DBA-Anrechnung: Quellensteuer</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value.toFixed(2)} EUR`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          ⚠️ Gemäß DBA (Art. 15 Abs. 4) können nur maximal 4,5% des Bruttolohns 
          als Quellensteuer in Österreich angerechnet werden.
        </p>
      </div>
    </div>
  );
}
```

---

### Schritt 7: Unit-Tests erweitern ✅ BEREIT

**Datei**: `app/tests/dba-credit.test.ts` (NEU)

```typescript
import { describe, it, expect } from 'vitest';
import { calculateCreditableSourceTax } from '@/lib/austrian-tax';

describe('DBA-Anrechnung (4,5%-Kappung)', () => {
  it('sollte bei 5,83% Quellensteuer nur 4,5% anrechnen', () => {
    const grossIncomeEUR = 6586.65; // 6333.70 CHF × 1.04
    const actualSourceTaxEUR = 384.02; // 369.25 CHF × 1.04 (5,83%)
    
    const result = calculateCreditableSourceTax(grossIncomeEUR, actualSourceTaxEUR);
    
    // Erwartete Werte
    const expectedCreditable = grossIncomeEUR * 0.045; // 296.40 EUR
    const expectedNonCreditable = actualSourceTaxEUR - expectedCreditable; // 87.62 EUR
    
    expect(result.creditable).toBeCloseTo(expectedCreditable, 2);
    expect(result.nonCreditable).toBeCloseTo(expectedNonCreditable, 2);
    expect(result.leakagePercent).toBeCloseTo(1.33, 2); // 1,33%
  });
  
  it('sollte bei niedriger Quellensteuer (<4,5%) alles anrechnen', () => {
    const grossIncomeEUR = 5000;
    const actualSourceTaxEUR = 200; // 4% (unter 4,5%)
    
    const result = calculateCreditableSourceTax(grossIncomeEUR, actualSourceTaxEUR);
    
    expect(result.creditable).toBe(200);
    expect(result.nonCreditable).toBe(0);
    expect(result.leakagePercent).toBe(0);
  });
  
  it('sollte bei hoher Quellensteuer (>4,5%) korrekt kappen', () => {
    const grossIncomeEUR = 8000;
    const actualSourceTaxEUR = 560; // 7% (deutlich über 4,5%)
    
    const result = calculateCreditableSourceTax(grossIncomeEUR, actualSourceTaxEUR);
    
    const expectedCreditable = 8000 * 0.045; // 360 EUR
    const expectedNonCreditable = 560 - 360; // 200 EUR
    
    expect(result.creditable).toBe(expectedCreditable);
    expect(result.nonCreditable).toBe(expectedNonCreditable);
    expect(result.leakagePercent).toBeCloseTo(2.5, 2); // 2,5%
  });
});
```

---

## 📋 Implementierungs-Reihenfolge

1. ✅ **Schritt 1**: Interfaces erweitern (`calculator.ts`)
2. ✅ **Schritt 2**: DBA-Funktion implementieren (`austrian-tax.ts`)
3. ✅ **Schritt 3**: Hauptberechnung aktualisieren (`calculator.ts`)
4. ✅ **Schritt 4**: PDF-Report erweitern (`PDFReport.tsx`)
5. ✅ **Schritt 5**: UI-Komponenten aktualisieren (`Calculator.tsx`)
6. ✅ **Schritt 6**: Neue Visualisierung erstellen (`TaxLeakageChart.tsx`)
7. ✅ **Schritt 7**: Unit-Tests schreiben (`dba-credit.test.ts`)
8. ✅ **Schritt 8**: Integration testen

---

## ⚠️ Breaking Changes

### Für Nutzer
- **Netto wird niedriger**: Die korrekte 4,5%-Kappung führt zu einem niedrigeren Netto als bisher berechnet
- **Neue Warnung**: Expliziter Ausweis der nicht anrechenbaren Steuer

### Für Entwickler
- `GrenzgaengerResult` Interface erweitert (neue Felder)
- `AustrianTaxResult` Interface erweitert (neue Felder)
- PDF-Report benötigt zusätzliche Props

---

## 🎯 Erwartete Ergebnisse

### Beispiel: Lohnabrechnung Alexander Moik (Februar 2026)

**Vorher (FALSCH)**:
- Angerechnete Quellensteuer: 384,02 EUR/Monat
- Monatsnetto: ~5.238 EUR

**Nachher (KORREKT)**:
- Anrechenbare Quellensteuer: 296,42 EUR/Monat (4,5%)
- Nicht anrechenbare Steuer: 87,60 EUR/Monat (Verlust)
- Monatsnetto: ~5.150 EUR
- **Differenz**: -88 EUR/Monat = -1.056 EUR/Jahr

---

## 📊 Validierung

Die Implementierung muss gegen folgende Quellen validiert werden:

1. **DBA Schweiz-Österreich**: Art. 15 Abs. 4
2. **BMF-Rechner**: [bmf.gv.at/services/rechner](https://www.bmf.gv.at/services/rechner)
3. **Reale Lohnzettel**: Alexander Moik (Februar 2026)

---

**Erstellt**: 3. März 2026  
**Status**: Bereit zur Implementierung  
**Priorität**: KRITISCH (Steuerrechtliche Korrektheit)
