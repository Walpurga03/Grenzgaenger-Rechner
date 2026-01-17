# Grenzgänger-Rechner St. Gallen (CH) ↔ Österreich (AT)

Ein professioneller Steuerrechner für Grenzgänger zwischen St. Gallen (Schweiz) und Österreich mit umfassender Steueroptimierungs-Anleitung.

## 🚀 Live Demo

**https://walpurga03.github.io/Grenzgaenger-Rechner/**

## ✨ Features

### Rechner
- **Präzise Steuerberechnung** mit korrekter DBA-Anrechnung
- **Schweizer Sozialversicherungen** (AHV, ALV, BVG, KTG, NBU)
- **St. Gallen Quellensteuer** mit progressiven Tarifen
- **Österreichische Einkommensteuer** mit allen Abzügen
- **13./14. Gehalt** mit begünstigter Besteuerung (6%)
- **Familienbonus Plus** und Alleinverdienerabsetzbetrag
- **Pendlerpauschale** und Pendlereuro
- **Dynamische Kinderdetails** (Alter, Wohnort, Ausbildung)
- **Echtzeit-Validierung** und hilfreiche Tooltips
- **Interaktive Visualisierungen** (Recharts)
- **PDF-Export** mit ausführlichen Erläuterungen

### Steuer-Tipps
- **Zulagen & Schichtarbeit** (SEG, SFN, Überstunden)
- **Werbungskosten** (Pendeln, Home-Office, Fortbildung)
- **Sonderausgaben** (Kirchenbeitrag, Spenden)
- **Außergewöhnliche Belastungen** (Krankheit, Behinderung)
- **Absetzbeträge** (Familienbonus, Alleinverdiener)
- **Profi-Tipps** für maximale Steuerersparnis

## 🛠️ Technologie-Stack

- **React 18** + **TypeScript** (Strict Mode)
- **Vite 7.3.1** - Ultraschneller Build
- **Tailwind CSS v3** - Modernes Styling
- **Recharts** - Datenvisualisierung
- **@react-pdf/renderer** - PDF-Generierung
- **Lucide React** - Icons
- **shadcn/ui** Patterns

## 📊 Berechnungsgrundlagen

### Schweiz (St. Gallen)
- AHV/IV/EO: 5,3%
- ALV: 1,1% (bis CHF 148.200), +0,5% darüber
- BVG (Pensionskasse): 7%
- KTG (Krankentaggeld): 1,4%
- NBU (Unfallversicherung): 1%
- Quellensteuer: ~4,5% (progressiv)

### Österreich
- Progressive Steuersätze: 0% - 50%
- 13./14. Gehalt: 6% Vorzugssteuersatz
- Familienbonus: 166,68€ bzw. 54,18€/Monat
- Pendlerpauschale: Entfernungsabhängig
- Krankenversicherung: Steuerlich abzugsfähig

### DBA (Doppelbesteuerungsabkommen)
- Schweizer Quellensteuer wird in AT voll angerechnet
- Keine Doppelbesteuerung
- Progressionsvorbehalt in Österreich

## 🚀 Installation & Entwicklung

```bash
# Repository klonen
git clone https://github.com/Walpurga03/Grenzgaenger-Rechner.git
cd Grenzgaenger-Rechner/app

# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build erstellen
npm run build
```

## 📁 Projektstruktur

```
app/
├── src/
│   ├── components/
│   │   ├── Calculator.tsx          # Hauptrechner
│   │   ├── TaxTips.tsx            # Steuer-Tipps
│   │   ├── BreakdownChart.tsx     # Visualisierungen
│   │   ├── PDFReport.tsx          # PDF-Export
│   │   └── ...
│   ├── lib/
│   │   ├── calculator.ts          # Hauptlogik
│   │   ├── swiss-deductions.ts    # CH-SV-Beiträge
│   │   ├── st-gallen-tax.ts      # SG Quellensteuer
│   │   ├── austrian-tax.ts       # AT Steuerberechnung
│   │   └── taxConfig.ts          # Steuertabellen
│   └── types/
│       └── calculator.ts          # TypeScript Definitionen
└── ...
```

## 🎯 Verwendung

1. **Bruttolohn eingeben** (CHF)
2. **Gehälter pro Jahr** wählen (12, 13 oder 14)
3. **Persönliche Daten** erfassen (Alter, Familienstand, Kinder)
4. **Pendelstrecke** angeben für automatische Berechnung
5. **Versicherung** und andere Abzüge eintragen
6. **Ergebnis ansehen** mit detaillierter Aufschlüsselung
7. **PDF exportieren** für Ihre Unterlagen

## 📝 Wichtige Hinweise

⚠️ **Disclaimer**: Diese Berechnung dient ausschließlich zu Informationszwecken und stellt keine Steuerberatung dar. Alle Angaben sind ohne Gewähr. Für verbindliche Auskünfte wenden Sie sich bitte an einen Steuerberater oder die zuständigen Finanzbehörden.

## 🤝 Beitragen

Contributions sind willkommen! Bitte erstellen Sie einen Pull Request oder öffnen Sie ein Issue.

## 📄 Lizenz

MIT License

---

**Letztes Update**: 17. Januar 2026 | Version 1.0.0
