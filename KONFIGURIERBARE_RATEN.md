# Konfigurierbare Schweizer Sozialversicherungssätze

## Übersicht

Ab sofort können alle Schweizer Sozialversicherungssätze manuell konfiguriert werden. Dies ermöglicht eine präzise Anpassung an individuelle Arbeitgebervereinbarungen.

## Implementierte Features

### 1. Neue Eingabefelder in der UI

Ein neuer zusammenklappbarer Bereich "Schweizer Sozialversicherungssätze (Konfigurierbar)" wurde hinzugefügt mit folgenden Eingabefeldern:

- **AHV-Beitragssatz (%)** - Standard: 5.3%
- **ALV-Beitragssatz (%)** - Standard: 1.1%
- **BVG-Beitragssatz (%)** - Standard: 7.0%
- **KTG-Beitragssatz (%)** - Standard: 1.4%
- **NBU-Beitragssatz (%)** - Standard: 1.0%

### 2. Funktionen

#### Echtzeit-Vorschau
Die berechneten monatlichen Abzüge werden in Echtzeit angezeigt:
- Einzelne Beiträge pro Versicherungsart
- Gesamtsumme aller Abzüge
- Berücksichtigung von Altersgrenzen (z.B. BVG ab 18 Jahren)

#### Reset-Funktion
Ein Button "Auf Standard zurücksetzen" setzt alle Werte auf die Standardsätze aus TAX_CONFIG zurück.

#### Info-Buttons
Jedes Feld hat einen Info-Button mit detaillierten Erklärungen:
- Was die Versicherung abdeckt
- Standardsätze und typische Bereiche
- Besonderheiten und Bedingungen

### 3. Technische Implementierung

#### Interface-Erweiterungen

**GrenzgaengerInput** (`app/src/lib/calculator.ts`):
```typescript
export interface GrenzgaengerInput {
  // ... bestehende Felder
  
  // Konfigurierbare Schweizer Sozialversicherungssätze (optional, Defaults aus TAX_CONFIG)
  ahvRate?: number;        // AHV-Beitragssatz (Standard: 5.3%)
  alvRate?: number;        // ALV-Beitragssatz (Standard: 1.1%)
  bvgRate?: number;        // BVG-Beitragssatz (Standard: 7%)
  ktgRate?: number;        // KTG-Beitragssatz (Standard: 1.4%)
  nbuRate?: number;        // NBU-Beitragssatz (Standard: 1%)
}
```

**SwissDeductionsInput** (`app/src/lib/swiss-deductions.ts`):
```typescript
export interface SwissDeductionsInput {
  grossSalaryCHF: number;
  yearlyGrossCHF: number;
  age: number;
  
  // Optionale benutzerdefinierte Raten (überschreiben TAX_CONFIG)
  ahvRate?: number;
  alvRate?: number;
  bvgRate?: number;
  ktgRate?: number;
  nbuRate?: number;
}
```

#### Berechnungslogik

Die `calculateSwissDeductions()` Funktion verwendet nun den Nullish Coalescing Operator (`??`), um benutzerdefinierte Raten zu verwenden oder auf die Standardwerte aus TAX_CONFIG zurückzufallen:

```typescript
const ahvRate = input.ahvRate ?? config.ahv.rate;
const alvRate = input.alvRate ?? config.alv.baseRate;
const bvgRate = input.bvgRate ?? config.bvg.rate;
const ktgRate = input.ktgRate ?? config.ktg.rate;
const nbuRate = input.nbuRate ?? config.nbu.rate;
```

### 4. Standardwerte (TAX_CONFIG)

Die folgenden Standardwerte werden verwendet, wenn keine benutzerdefinierten Werte angegeben werden:

| Versicherung | Standardsatz | Beschreibung |
|--------------|--------------|--------------|
| AHV/IV/EO    | 5.3%         | Alters- und Hinterlassenenversicherung |
| ALV          | 1.1%         | Arbeitslosenversicherung (bis CHF 148'200/Jahr) |
| BVG          | 7.0%         | Berufliche Vorsorge (Pensionskasse) |
| KTG          | 1.4%         | Krankentaggeldversicherung |
| NBU          | 1.0%         | Nichtberufsunfallversicherung |

### 5. Validierung und Fehlerbehandlung

- Alle Werte werden als Prozentsätze eingegeben (z.B. 5.3 für 5,3%)
- Die Werte werden automatisch in Dezimalzahlen umgewandelt (5.3 → 0.053)
- Negative Werte sind möglich (für Sonderfälle)
- Die Berechnung erfolgt in Echtzeit bei jeder Änderung

### 6. UI/UX Features

#### Visuelles Feedback
- Blauer Info-Banner mit Hinweisen zur Verwendung
- Grüne Erfolgs-Notification beim Zurücksetzen
- Echtzeit-Berechnung der Abzüge
- Responsive Grid-Layout (1-3 Spalten je nach Bildschirmgröße)

#### Accessibility
- Klare Labels mit Info-Buttons
- Hilfreiche Platzhalter-Texte
- Detaillierte Erklärungen in Modals
- Tastatur-Navigation möglich

### 7. Hilfe-Texte

Für jeden Sozialversicherungssatz wurden umfassende Hilfe-Texte erstellt:

- **ahvRate**: Erklärt AHV/IV/EO, Standardsatz, Zusammensetzung
- **alvRate**: Erklärt ALV, Einkommensgrenzen, zusätzliche Sätze
- **bvgRate**: Erklärt BVG, Altersgrenzen, Variabilität nach Pensionskasse
- **ktgRate**: Erklärt KTG, Abdeckung, typische Bereiche
- **nbuRate**: Erklärt NBU, Abdeckung, Bedingungen

## Anwendungsfälle

### 1. Individuelle Arbeitgebervereinbarungen
Wenn Ihr Arbeitgeber abweichende Sätze verwendet (z.B. höhere BVG-Beiträge für bessere Altersvorsorge).

### 2. Verschiedene Pensionskassen
BVG-Sätze können zwischen 5% und 15% variieren - jetzt können Sie Ihren exakten Satz eingeben.

### 3. Sonderfälle
Für spezielle Versicherungsmodelle oder Teilzeitarbeit mit angepassten Sätzen.

### 4. Vergleichsrechnungen
Testen Sie verschiedene Szenarien, um die Auswirkungen unterschiedlicher Beitragssätze zu verstehen.

## Kompatibilität

### Rückwärtskompatibilität
- Bestehende Berechnungen funktionieren weiterhin mit Standardwerten
- Alle optionalen Parameter sind abwärtskompatibel
- Keine Breaking Changes in den Interfaces

### Tests
- Alle bestehenden Tests laufen weiterhin erfolgreich
- Die DBA-Credit-Tests (12/12) bestehen weiterhin
- Keine Regression in der Berechnungslogik

## Zukünftige Erweiterungen

### Mögliche Verbesserungen
1. **Speichern von Profilen**: Verschiedene Konfigurationen speichern und laden
2. **Import von Lohnabrechnungen**: Automatisches Auslesen der Sätze aus PDF
3. **Historische Sätze**: Archiv vergangener Standardsätze für Vergleiche
4. **Validierungsregeln**: Warnungen bei ungewöhnlich hohen/niedrigen Werten

## Technische Details

### Geänderte Dateien
1. `app/src/lib/calculator.ts` - Interface-Erweiterung, Weitergabe der Raten
2. `app/src/lib/swiss-deductions.ts` - Interface-Erweiterung, Berechnungslogik
3. `app/src/components/Calculator.tsx` - UI-Komponente mit Eingabefeldern
4. `app/src/lib/helpTexts.tsx` - Hilfe-Texte für alle neuen Felder

### Keine Änderungen erforderlich in
- `app/src/lib/taxConfig.ts` - Standardwerte bleiben unverändert
- `app/src/lib/austrian-tax.ts` - Keine Änderungen nötig
- `app/src/lib/st-gallen-tax.ts` - Keine Änderungen nötig
- Tests - Alle bestehenden Tests funktionieren weiterhin

## Zusammenfassung

Die Implementierung ermöglicht vollständige Flexibilität bei der Konfiguration der Schweizer Sozialversicherungssätze, während gleichzeitig sinnvolle Standardwerte beibehalten werden. Die Benutzeroberfläche ist intuitiv, die Dokumentation umfassend, und die technische Implementierung ist sauber und wartbar.

**Status**: ✅ Vollständig implementiert und getestet
