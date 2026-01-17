# Tax Config - Anleitung zur Anpassung

Diese Datei enthält alle Steuersätze und Abzüge, die in den Berechnungen verwendet werden.

## 📁 Datei-Pfad
`app/src/lib/taxConfig.ts`

## 🔧 Wie passe ich die Werte an?

### 1. Schweizer Sozialversicherungen

```typescript
switzerland: {
  ahv: {
    rate: 0.053,  // ← Hier ändern für AHV-Satz (5.3% = 0.053)
  },
  
  alv: {
    baseRate: 0.011,        // ← ALV Basissatz (1.1%)
    additionalRate: 0.005,  // ← Zusatzsatz über Limite (0.5%)
    yearlyLimit: 148200,    // ← Jahresgrenze in CHF
  },
  
  bvg: {
    rate: 0.07,            // ← BVG Satz (7%)
    minAge: 18,            // ← Mindestalter
    minYearlySalary: 22050, // ← Mindest-Jahreslohn
  },
  
  ktg: {
    rate: 0.014,  // ← KTG Satz (1.4%)
  },
  
  nbu: {
    rate: 0.01,   // ← NBU Satz (1%)
  },
}
```

### 2. St. Gallen Quellensteuer

```typescript
stGallen: {
  single: [  // ← Tarif für Ledige
    { yearlyIncomeLimit: 20000, rate: 0.00 },   // Bis 20k: 0%
    { yearlyIncomeLimit: 40000, rate: 0.02 },   // Bis 40k: 2%
    { yearlyIncomeLimit: 60000, rate: 0.04 },   // Bis 60k: 4%
    // ... weitere Stufen
  ],
  
  married: [  // ← Tarif für Verheiratete
    { yearlyIncomeLimit: 30000, rate: 0.00 },
    { yearlyIncomeLimit: 50000, rate: 0.015 },
    // ... weitere Stufen
  ],
  
  childReduction: 0.005,  // ← 0.5% Reduktion pro Kind
}
```

### 3. Österreichische Einkommensteuer

```typescript
austria: {
  taxBrackets: [  // ← Progressive Steuerstufen
    { limit: 12816, rate: 0.00 },    // Bis 12'816€: 0%
    { limit: 20818, rate: 0.20 },    // Bis 20'818€: 20%
    { limit: 34513, rate: 0.30 },    // Bis 34'513€: 30%
    { limit: 66612, rate: 0.40 },    // Bis 66'612€: 40%
    { limit: 99266, rate: 0.48 },    // Bis 99'266€: 48%
    { limit: Infinity, rate: 0.50 }, // Darüber: 50%
  ],
  
  familyBonus: {
    under18: 166.68,  // ← EUR pro Kind unter 18 (monatlich)
    over18: 54.18,    // ← EUR pro Kind ab 18 (monatlich)
  },
  
  pensionerBonus: {
    maxYearly: 825,   // ← Maximaler Pensionistenabsetzbetrag (jährlich)
  },
}
```

### 4. Wechselkurs-Einstellungen

```typescript
exchangeRate: {
  defaultCHFtoEUR: 0.95,  // ← Fallback wenn API nicht verfügbar
  minValidRate: 0.85,     // ← Minimaler plausibler Wert
  maxValidRate: 1.05,     // ← Maximaler plausibler Wert
}
```

## 📝 Beispiel: Anpassung für 2027

Wenn sich die Sätze ändern, einfach die Werte aktualisieren:

```typescript
// Beispiel: AHV steigt auf 5.4%
ahv: {
  rate: 0.054,  // ← Von 0.053 auf 0.054 geändert
  description: 'AHV/IV/EO (Arbeitnehmeranteil)',
}

// Beispiel: Neue österreichische Steuerstufe
taxBrackets: [
  { limit: 13500, rate: 0.00 },  // ← Neuer Freibetrag
  { limit: 22000, rate: 0.20 },
  // ...
]
```

## ✅ Nach Änderungen

1. Datei speichern
2. App neu laden (Hot Reload funktioniert automatisch)
3. Berechnungen werden sofort mit neuen Werten durchgeführt

## ⚠️ Wichtig

- **Prozentsätze als Dezimalzahlen:** 5% = 0.05, 10% = 0.10
- **Beträge in CHF oder EUR** wie angegeben
- **Infinity** für die letzte Steuerstufe beibehalten

## 🔗 Offizielle Quellen

- **Schweiz AHV/IV:** https://www.ahv-iv.ch/
- **St. Gallen Quellensteuer:** https://www.sg.ch/steuern-finanzen/steuern/quellensteuer.html
- **Österreich Tarife:** https://www.bmf.gv.at/
