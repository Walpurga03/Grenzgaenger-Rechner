# Masterplan: Grenzgänger-Rechner (SG-AT)

## 📋 Zusammenfassung

Eine hochprofessionelle, lokal laufende **Single-Page-Application (SPA)** für Grenzgänger zwischen dem Kanton St. Gallen und Österreich, die komplexe Steuerberechnungen nach dem Doppelbesteuerungsabkommen (DBA) durchführt und einen detaillierten PDF-Bericht erstellt.

---

## 1. Projektübersicht und Ziele

### Problem
Grenzgänger stehen vor der Herausforderung, zwei Steuersysteme (Quellensteuer CH vs. Einkommensteuer AT unter Progressionsvorbehalt) korrekt abzubilden, um ihr tatsächliches Netto-Einkommen und potenzielle Nachzahlungen zu verstehen.

### Lösung
Ein präziser Kalkulator, der Schweizer Abzüge und österreichische Steuerregeln kombiniert, ohne Daten in die Cloud zu schicken.

### Ziele
- ✅ Intuitive Benutzerführung
- ✅ 100% Datenschutz durch lokale Verarbeitung
- ✅ Professioneller PDF-Export als Dokumentationsgrundlage

---

## 2. Zielgruppe

### Primäre Nutzer
In Österreich wohnhafte Personen, die im Kanton St. Gallen arbeiten (Grenzgänger).

### Nutzer-Szenarien
- Gehaltsverhandlungen vor einem neuen Job
- Jährliche Finanzplanung
- Vorbereitung auf die Arbeitnehmerveranlagung

---

## 3. Kernfunktionen (Features)

### Für das MVP (Minimum Viable Product)

#### ✨ Dynamische Eingabemaske
Formular für Schweizer Lohndaten (Brutto, AHV, BVG etc.) und österreichische Steuermerkmale (Pendlerpauschale, Familienbonus).

#### ⚡ Echtzeit-Berechnung
Sofortige Aktualisierung des Netto-Betrags bei Änderung der Input-Werte (Reaktivität durch React).

#### 💱 Währungs-Konverter
Integration der EZB-Kurse (via Proxy oder statischem Tageswert) zur Umrechnung CHF zu EUR.

#### 📄 Professioneller PDF-Export
Download eines sauber formatierten Berichts mit allen Berechnungsschlüsseln.

### Zukünftige Erweiterungen

- 📊 **Szenarien-Vergleich**: Zwei Berechnungen nebeneinander (z.B. Vollzeit vs. Teilzeit)
- 🌙 **Dark-Mode Unterstützung**: Für ein modernes Look-and-Feel
- 💾 **History-Funktion**: Lokale Speicherung im Browser (LocalStorage), falls der Nutzer dies explizit möchte

---

## 4. Empfehlung für den Tech-Stack (High-Level)

| Komponente | Technologie | Begründung |
|------------|-------------|------------|
| **Plattform** | Web-Applikation | Lokal ausführbar via Browser oder `npm run dev` |
| **Frontend-Framework** | React (TypeScript) mit Vite | Extrem schnell, modern, typensicher |
| **Styling** | Tailwind CSS & shadcn/ui | Design auf Apple-Niveau |
| **State Management** | React-Hooks | `useMemo` für komplexe Berechnungen |
| **Logik** | TypeScript | Strenge Typisierung der Steuerformeln zur Fehlervermeidung |
| **PDF-Engine** | react-pdf oder jsPDF | Deklaratives Design von PDF-Dokumenten |

---

## 5. Konzeptuelles Datenmodell (Lokal)

### Input-Datenstrukturen

```typescript
interface IncomeInput {
  salaryCHF: number;
  bonusCHF: number;
  exchangeRate: number;
  is13thSalary: boolean;
}

interface DeductionsCH {
  ahvRate: number;
  alvRate: number;
  bvgAmount: number;
  ktgAmount: number;
  sourceTaxSG: number;
}

interface AllowancesAT {
  commuterFlatrate: number;  // Pendlerpauschale
  pensionerBonus: number;
  familyBonusPlus: number;
}

interface CalculationResult {
  grossEUR: number;
  netCH: number;
  atTaxLiability: number;
  finalNetEUR: number;
}
```

---

## 6. Design- und UX-Prinzipien

### Progressive Disclosure
Komplexe Steuermerkmale werden erst eingeblendet, wenn sie relevant sind.

### Visual Feedback
Nutzung von Diagrammen (z.B. **Recharts**), um die Verteilung der Abzüge (SV vs. Steuer) zu visualisieren.

### Clean Design
- Fokus auf Lesbarkeit
- Viel Weißraum
- Professionelle Typografie

---

## 7. Potenzielle Herausforderungen und Lösungsansätze

### Herausforderung 1: Präzision der Steuerformel (Tarifstufen AT)

**Lösungsidee**: Kapselung der Steuerlogik in isolierten, testbaren TypeScript-Funktionen (Unit-Tests).

### Herausforderung 2: Lokale Währungskurse ohne Backend-API (CORS-Problematik)

**Lösungsidee**: Nutze einen Fallback-Mechanismus (manueller Input des Kurses möglich, falls API-Aufruf lokal blockiert wird).

---

## 8. Entwicklungsphasen (Meilensteine)

### Phase 1: Setup 🏗️
- [ ] Vite-Projekt aufsetzen
- [ ] Tailwind & shadcn integrieren
- [ ] Grundgerüst der UI (Sidebar/Main-Content)

### Phase 2: Logic 🧮
- [ ] Implementierung der mathematischen Formeln für St. Gallen
- [ ] Implementierung der österreichischen Steuerlogik (Core-Logik)

### Phase 3: UI/Features ⚙️
- [ ] Bau der interaktiven Formulare
- [ ] Validierung der Eingaben

### Phase 4: Reporting 📊
- [ ] Implementierung des PDF-Exports
- [ ] Finaler Design-Schliff

---

**Erstellt**: 13. Januar 2026  
**Status**: In Planung  
**Zielregion**: Kanton St. Gallen (CH) ↔️ Österreich (AT)