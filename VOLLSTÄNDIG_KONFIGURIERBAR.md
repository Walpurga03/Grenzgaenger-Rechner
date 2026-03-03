# Vollständig Konfigurierbare Werte (außer Wechselkurs)

## Übersicht

Alle Werte im Grenzgänger-Rechner sind jetzt manuell konfigurierbar, mit Ausnahme des Wechselkurses, der automatisch von der EZB geladen wird (aber auch manuell angepasst werden kann).

## ✅ Implementierte Konfigurierbare Werte

### 1. Schweizer Sozialversicherungssätze

**Eingabefelder:**
- **AHV-Beitragssatz (%)** - Standard: 5.3%
- **ALV-Beitragssatz (%)** - Standard: 1.1%
- **BVG-Beitragssatz (%)** - Standard: 7.0%
- **KTG-Beitragssatz (%)** - Standard: 1.4%
- **NBU-Beitragssatz (%)** - Standard: 1.0%

**Features:**
- Echtzeit-Vorschau der berechneten monatlichen Abzüge
- Reset-Button zum Zurücksetzen auf Standardwerte
- Detaillierte Info-Buttons mit Erklärungen
- Automatische Berücksichtigung von Altersgrenzen (z.B. BVG ab 18 Jahren)

**UI-Position:** Zusammenklappbarer Bereich "Schweizer Sozialversicherungssätze (Konfigurierbar)"

### 2. Quellensteuer St. Gallen

**Eingabefeld:**
- **Quellensteuer (CHF) monatlich** - Optional, sonst automatisch berechnet

**Features:**
- Checkbox zum Aktivieren/Deaktivieren der manuellen Eingabe
- Automatische Berechnung basierend auf:
  - Bruttolohn
  - Familienstand
  - Anzahl Kinder
- Manuelle Eingabe überschreibt automatische Berechnung komplett
- Visuelles Feedback (grün = automatisch, gelb = manuell)
- Detaillierter Info-Button mit Beispielwerten

**UI-Position:** Im Bereich "Schweizer Sozialversicherungssätze", nach den Beitragssätzen

### 3. Wechselkurs (bereits vorhanden)

**Eingabefeld:**
- **Wechselkurs: 1 CHF = ? EUR**

**Features:**
- Automatisches Laden von der EZB beim Start
- Manueller Refresh-Button
- Manuelle Eingabe möglich
- Zeitstempel der letzten Aktualisierung

## Technische Implementierung

### Interface-Erweiterungen

#### [`GrenzgaengerInput`](app/src/lib/calculator.ts:12)
```typescript
export interface GrenzgaengerInput {
  // ... bestehende Felder
  
  // Konfigurierbare Schweizer Sozialversicherungssätze (optional)
  ahvRate?: number;
  alvRate?: number;
  bvgRate?: number;
  ktgRate?: number;
  nbuRate?: number;
  
  // Konfigurierbare Quellensteuer (optional)
  manualSourceTaxCHF?: number;
}
```

#### [`SwissDeductionsInput`](app/src/lib/swiss-deductions.ts:8)
```typescript
export interface SwissDeductionsInput {
  grossSalaryCHF: number;
  yearlyGrossCHF: number;
  age: number;
  
  // Optionale benutzerdefinierte Raten
  ahvRate?: number;
  alvRate?: number;
  bvgRate?: number;
  ktgRate?: number;
  nbuRate?: number;
}
```

### Berechnungslogik

#### Sozialversicherungssätze
Die [`calculateSwissDeductions()`](app/src/lib/swiss-deductions.ts:27) Funktion verwendet den Nullish Coalescing Operator:

```typescript
const ahvRate = input.ahvRate ?? config.ahv.rate;
const alvRate = input.alvRate ?? config.alv.baseRate;
// ... etc.
```

#### Quellensteuer
Die [`calculateGrenzgaenger()`](app/src/lib/calculator.ts:107) Funktion prüft, ob eine manuelle Quellensteuer angegeben wurde:

```typescript
let monthlySourceTaxCHF: number;

if (input.manualSourceTaxCHF !== undefined && input.manualSourceTaxCHF !== null) {
  // Manuelle Quellensteuer verwenden
  monthlySourceTaxCHF = input.manualSourceTaxCHF;
} else {
  // Automatisch berechnen
  const stGallenTax = calculateStGallenTax({
    grossSalaryCHF: grossSalaryCHF,
    maritalStatus: input.maritalStatus,
    children: input.childrenDetails.length,
  });
  monthlySourceTaxCHF = stGallenTax.sourceTax;
}
```

### UI-Komponenten

#### State-Variablen in [`Calculator.tsx`](app/src/components/Calculator.tsx:1)
```typescript
// Sozialversicherungssätze
const [ahvRate, setAhvRate] = useState<number>(5.3);
const [alvRate, setAlvRate] = useState<number>(1.1);
const [bvgRate, setBvgRate] = useState<number>(7.0);
const [ktgRate, setKtgRate] = useState<number>(1.4);
const [nbuRate, setNbuRate] = useState<number>(1.0);

// Manuelle Quellensteuer
const [useManualSourceTax, setUseManualSourceTax] = useState<boolean>(false);
const [manualSourceTax, setManualSourceTax] = useState<number>(0);
```

#### Weitergabe an Berechnungsfunktion
```typescript
const input: GrenzgaengerInput = {
  // ... andere Felder
  ahvRate: ahvRate / 100,  // Prozent -> Dezimal
  alvRate: alvRate / 100,
  bvgRate: bvgRate / 100,
  ktgRate: ktgRate / 100,
  nbuRate: nbuRate / 100,
  manualSourceTaxCHF: useManualSourceTax ? manualSourceTax : undefined,
};
```

## Hilfe-Texte

Alle neuen Felder haben umfassende Hilfe-Texte in [`helpTexts.tsx`](app/src/lib/helpTexts.tsx:1):

### Sozialversicherungssätze
- **ahvRate**: Erklärt AHV/IV/EO, Standardsatz 5.3%, Zusammensetzung
- **alvRate**: Erklärt ALV, Einkommensgrenzen, zusätzliche Sätze
- **bvgRate**: Erklärt BVG, Altersgrenzen, Variabilität (5-15%)
- **ktgRate**: Erklärt KTG, Abdeckung, typische Bereiche (0.5-2%)
- **nbuRate**: Erklärt NBU, Abdeckung, Bedingungen (0.5-2%)

### Quellensteuer
- **manualSourceTax**: Erklärt wann sinnvoll, wie zu finden, Beispielwerte

## Anwendungsfälle

### 1. Individuelle Arbeitgebervereinbarungen
Wenn Ihr Arbeitgeber abweichende Sätze verwendet:
- Höhere BVG-Beiträge für bessere Altersvorsorge
- Spezielle KTG/NBU-Versicherungsmodelle
- Teilzeitarbeit mit angepassten Sätzen

### 2. Präzise Quellensteuer
Wenn die automatische Berechnung von Ihrer Lohnabrechnung abweicht:
- Spezielle Tarife Ihres Arbeitgebers
- Komplexe Familiensituationen
- Sonderfälle bei der Quellensteuer

### 3. Vergleichsrechnungen
Testen Sie verschiedene Szenarien:
- Auswirkungen höherer/niedrigerer Beitragssätze
- Vergleich verschiedener Pensionskassen
- "Was-wäre-wenn"-Analysen

### 4. Exakte Nachbildung der Lohnabrechnung
Geben Sie alle Werte aus Ihrer Lohnabrechnung ein:
- Sozialversicherungssätze aus der Abrechnung
- Exakte Quellensteuer aus der Abrechnung
- Ergebnis: 1:1 Übereinstimmung mit Ihrer realen Situation

## Standardwerte (TAX_CONFIG)

Wenn keine benutzerdefinierten Werte angegeben werden, gelten folgende Standardwerte:

| Wert | Standard | Quelle |
|------|----------|--------|
| AHV/IV/EO | 5.3% | TAX_CONFIG.switzerland.ahv.rate |
| ALV | 1.1% | TAX_CONFIG.switzerland.alv.baseRate |
| BVG | 7.0% | TAX_CONFIG.switzerland.bvg.rate |
| KTG | 1.4% | TAX_CONFIG.switzerland.ktg.rate |
| NBU | 1.0% | TAX_CONFIG.switzerland.nbu.rate |
| Quellensteuer | Automatisch | Berechnet nach Tarif St. Gallen |

## Validierung und Fehlerbehandlung

### Sozialversicherungssätze
- Eingabe als Prozentsätze (z.B. 5.3 für 5,3%)
- Automatische Umwandlung in Dezimalzahlen (5.3 → 0.053)
- Negative Werte möglich (für Sonderfälle)
- Echtzeit-Berechnung bei jeder Änderung

### Quellensteuer
- Eingabe in CHF (monatlich)
- Nur aktiv wenn Checkbox aktiviert
- Überschreibt automatische Berechnung komplett
- Visuelles Feedback über aktiven Modus

## UI/UX Features

### Visuelles Feedback
- **Blauer Info-Banner**: Hinweise zur Verwendung
- **Grüne Erfolgs-Notification**: Beim Zurücksetzen der Werte
- **Gelber Bereich**: Manuelle Quellensteuer aktiv
- **Grüner Bereich**: Automatische Quellensteuer aktiv
- **Echtzeit-Berechnung**: Sofortige Anzeige der Abzüge

### Accessibility
- Klare Labels mit Info-Buttons
- Hilfreiche Platzhalter-Texte
- Detaillierte Erklärungen in Modals
- Tastatur-Navigation möglich
- Responsive Grid-Layout (1-3 Spalten)

### Benutzerführung
- Standardwerte sind vorausgefüllt
- Reset-Button für einfaches Zurücksetzen
- Checkbox für manuelle Quellensteuer
- Farbcodierung für verschiedene Modi
- Beispielwerte in Hilfe-Texten

## Geänderte Dateien

### Core-Logik
1. **[`app/src/lib/calculator.ts`](app/src/lib/calculator.ts:1)**
   - Interface `GrenzgaengerInput` erweitert
   - Logik für manuelle Quellensteuer hinzugefügt
   - Weitergabe der Raten an Subfunktionen

2. **[`app/src/lib/swiss-deductions.ts`](app/src/lib/swiss-deductions.ts:1)**
   - Interface `SwissDeductionsInput` erweitert
   - Berechnungslogik mit optionalen Raten angepasst

### UI-Komponenten
3. **[`app/src/components/Calculator.tsx`](app/src/components/Calculator.tsx:1)**
   - State-Variablen für alle konfigurierbaren Werte
   - UI-Bereich "Schweizer Sozialversicherungssätze"
   - Eingabefelder für alle 5 Sozialversicherungssätze
   - Checkbox und Eingabefeld für manuelle Quellensteuer
   - Reset-Button für Standardwerte
   - Echtzeit-Vorschau der Abzüge

### Dokumentation
4. **[`app/src/lib/helpTexts.tsx`](app/src/lib/helpTexts.tsx:1)**
   - 6 neue Hilfe-Texte (5 Sozialversicherungssätze + Quellensteuer)
   - Detaillierte Erklärungen mit Beispielen
   - Standardwerte und typische Bereiche

5. **[`KONFIGURIERBARE_RATEN.md`](KONFIGURIERBARE_RATEN.md:1)**
   - Dokumentation der Sozialversicherungssätze

6. **[`VOLLSTÄNDIG_KONFIGURIERBAR.md`](VOLLSTÄNDIG_KONFIGURIERBAR.md:1)** (diese Datei)
   - Gesamtübersicht aller konfigurierbaren Werte

## Kompatibilität

### Rückwärtskompatibilität
✅ Alle bestehenden Berechnungen funktionieren mit Standardwerten  
✅ Alle optionalen Parameter sind abwärtskompatibel  
✅ Keine Breaking Changes in den Interfaces  
✅ Tests laufen weiterhin erfolgreich (12/12)

### Build-Status
✅ TypeScript-Kompilierung erfolgreich  
✅ Vite-Build erfolgreich (6.13s)  
✅ Keine Fehler oder Warnungen  
✅ Bundle-Größe: 2.28 MB (733 KB gzip)

## Zusammenfassung

### Was ist jetzt konfigurierbar?

| Kategorie | Werte | Status |
|-----------|-------|--------|
| **Schweizer Sozialversicherung** | AHV, ALV, BVG, KTG, NBU | ✅ Vollständig |
| **Schweizer Quellensteuer** | Monatlicher Betrag (CHF) | ✅ Vollständig |
| **Wechselkurs** | CHF → EUR | ✅ Bereits vorhanden |
| **Österreichische Pauschalen** | Pendler, Familie, etc. | ✅ Bereits vorhanden |

### Was ist NICHT konfigurierbar?

- **Österreichische Steuersätze**: Gesetzlich festgelegt, keine Anpassung möglich
- **DBA-Regelungen**: 4,5%-Kappung ist gesetzlich vorgegeben
- **Familienbonus-Sätze**: Gesetzlich festgelegt (€166.68 / €54.18)
- **Pendlerpauschale-Staffelung**: Gesetzlich festgelegt nach Distanz

Diese Werte sind bewusst nicht konfigurierbar, da sie gesetzlich vorgegeben sind und eine manuelle Änderung zu falschen Steuererklärungen führen würde.

## Nächste Schritte

Die folgenden Features sind noch ausstehend:

1. **PDF-Report erweitern** mit Kennzahlen (701, 721, 377, 374, 770)
2. **"Steuer-Leakage" Visualisierung** hinzufügen
3. **UI-Komponenten** für bessere Transparenz aktualisieren

**Status**: ✅ Vollständig konfigurierbar (außer Wechselkurs und gesetzliche Werte)
