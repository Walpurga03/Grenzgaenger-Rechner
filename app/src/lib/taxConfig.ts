/**
 * Zentrale Konfiguration für alle Steuersätze und Abzüge
 * Hier können alle Prozentsätze einfach angepasst werden
 * 
 * Stand: 2026
 * 
 * QUELLEN:
 * - Schweizer Sozialversicherungen: https://www.ahv-iv.ch/
 * - St. Gallen Quellensteuer: https://www.sg.ch/steuern-finanzen/steuern/quellensteuer.html
 * - Österreichische Steuern: https://www.bmf.gv.at/
 * - Doppelbesteuerungsabkommen CH-AT: https://www.admin.ch/
 */

export const TAX_CONFIG = {
  /**
   * SCHWEIZER SOZIALVERSICHERUNGEN
   * 
   * Quellen:
   * - AHV/IV/EO: https://www.ahv-iv.ch/de/Merkblätter-Formulare/Merkblätter
   * - ALV: https://www.seco.admin.ch/seco/de/home/Arbeit/Arbeitslosenversicherung.html
   * - BVG: https://www.bsv.admin.ch/bsv/de/home/sozialversicherungen/bv.html
   * - Detaillierte Beitragssätze: https://www.bsv.admin.ch/bsv/de/home/publikationen-und-service/aktuell.html
   */
  switzerland: {
    // AHV/IV/EO - Alters- und Hinterlassenenversicherung
    // Quelle: https://www.ahv-iv.ch/de/Merkblätter-Formulare/Beiträge-Arbeitnehmende-Arbeitgebende
    ahv: {
      rate: 0.053, // 5.3% Arbeitnehmeranteil
      description: 'AHV/IV/EO (Arbeitnehmeranteil)',
    },

    // ALV - Arbeitslosenversicherung
    // Quelle: https://www.seco.admin.ch/seco/de/home/Arbeit/Arbeitslosenversicherung/beitraege.html
    alv: {
      baseRate: 0.011, // 1.1% bis Limite
      additionalRate: 0.005, // 0.5% über Limite
      yearlyLimit: 148200, // CHF jährlich (Stand 2026)
      description: 'Arbeitslosenversicherung',
    },

    // BVG - Berufliche Vorsorge (Pensionskasse)
    // Quelle: https://www.bsv.admin.ch/bsv/de/home/sozialversicherungen/bv.html
    // Hinweis: Der Satz variiert je nach Pensionskasse (durchschnittlich 6-8%)
    bvg: {
      rate: 0.07, // 7% (Durchschnitt, kann variieren)
      minAge: 18, // Ab 18 Jahren
      minYearlySalary: 22050, // CHF jährlich (Eintrittsschwelle)
      description: 'Berufliche Vorsorge (Pensionskasse)',
    },

    // KTG - Krankentaggeldversicherung
    // Hinweis: Satz variiert je nach Arbeitgeber/Versicherung
    ktg: {
      rate: 0.014, // 1.4% (Durchschnittswert)
      description: 'Krankentaggeldversicherung',
    },

    // NBU - Nichtberufsunfallversicherung
    // Quelle: https://www.suva.ch/
    nbu: {
      rate: 0.01, // 1% (Durchschnittswert)
      description: 'Nichtberufsunfallversicherung',
    },
  },

  /**
   * ST. GALLEN QUELLENSTEUER
   * Vereinfachte progressive Steuersätze
   * 
   * Quelle: https://www.sg.ch/steuern-finanzen/steuern/quellensteuer.html
   * Tarife: https://www.sg.ch/steuern-finanzen/steuern/quellensteuer/tarife.html
   */
  stGallen: {
    // Tarif für Alleinstehende (single)
    single: [
      { yearlyIncomeLimit: 20000, rate: 0.00 },
      { yearlyIncomeLimit: 40000, rate: 0.02 },
      { yearlyIncomeLimit: 60000, rate: 0.04 },
      { yearlyIncomeLimit: 80000, rate: 0.06 },
      { yearlyIncomeLimit: 100000, rate: 0.08 },
      { yearlyIncomeLimit: Infinity, rate: 0.10 },
    ],

    // Tarif für Verheiratete (married)
    married: [
      { yearlyIncomeLimit: 30000, rate: 0.00 },
      { yearlyIncomeLimit: 50000, rate: 0.015 },
      { yearlyIncomeLimit: 70000, rate: 0.03 },
      { yearlyIncomeLimit: 90000, rate: 0.05 },
      { yearlyIncomeLimit: 110000, rate: 0.07 },
      { yearlyIncomeLimit: Infinity, rate: 0.09 },
    ],

    // Kinderabzug pro Kind
    childReduction: 0.005, // 0.5% Reduktion pro Kind
  },

  /**
   * ÖSTERREICHISCHE EINKOMMENSTEUER
   * Progressive Steuersätze 2026
   * 
   * Quelle: https://www.bmf.gv.at/themen/steuern/arbeitnehmerinnenveranlagung/tarifstufen.html
   * Familienbonus Plus: https://www.bmf.gv.at/themen/steuern/arbeitnehmerinnenveranlagung/familienbonus-plus.html
   * Pensionistenabsetzbetrag: https://www.bmf.gv.at/themen/steuern/arbeitnehmerinnenveranlagung/absetzbetraege.html
   * Pendlerpauschale: https://www.bmf.gv.at/themen/steuern/arbeitnehmerinnenveranlagung/pendlerpauschale.html
   */
  austria: {
    taxBrackets: [
      { limit: 12816, rate: 0.00 },    // Steuerfrei
      { limit: 20818, rate: 0.20 },    // 20%
      { limit: 34513, rate: 0.30 },    // 30%
      { limit: 66612, rate: 0.40 },    // 40%
      { limit: 99266, rate: 0.48 },    // 48%
      { limit: Infinity, rate: 0.50 }, // 50%
    ],

    // Familienbonus Plus (monatlich)
    familyBonus: {
      under18: 166.68, // EUR pro Kind unter 18
      over18: 54.18,   // EUR pro Kind ab 18
    },

    // Pendlereuro - Direkter Abzug von der Steuer
    // Formel: Entfernung in km × 2 pro Jahr
    // Quelle: https://www.bmf.gv.at/themen/steuern/arbeitnehmerinnenveranlagung/pendlereuro.html
    pendlerEuro: {
      ratePerKm: 2, // EUR pro km pro Jahr
    },

    // Alleinverdienerabsetzbetrag
    // Quelle: https://www.bmf.gv.at/themen/steuern/arbeitnehmerinnenveranlagung/absetzbetraege.html
    soleEarnerBonus: {
      maxPartnerIncome: 6937, // EUR pro Jahr (2024/2025)
      withOneChild: 572,      // EUR pro Jahr (mit 1 Kind)
      perAdditionalChild: 206, // EUR pro Jahr (pro weiteres Kind)
    },

    // Pensionistenabsetzbetrag
    pensionerBonus: {
      maxYearly: 825, // EUR maximal pro Jahr
    },

    // Pendlerpauschale (jährlich)
    // Quelle: https://www.bmf.gv.at/themen/steuern/arbeitnehmerinnenveranlagung/pendlerpauschale.html
    commuterAllowance: {
      // Kleines Pendlerpauschale (öffentliche Verkehrsmittel zumutbar)
      small: [
        { minKm: 20, maxKm: 40, yearly: 696 },
        { minKm: 40, maxKm: 60, yearly: 1356 },
        { minKm: 60, maxKm: Infinity, yearly: 2016 },
      ],
      // Großes Pendlerpauschale (öffentliche Verkehrsmittel unzumutbar)
      large: [
        { minKm: 2, maxKm: 20, yearly: 372 },
        { minKm: 20, maxKm: 40, yearly: 1476 },
        { minKm: 40, maxKm: 60, yearly: 2568 },
        { minKm: 60, maxKm: Infinity, yearly: 3672 },
      ],
    },

    // Sonderzahlungen (13. und 14. Gehalt) - begünstigte Besteuerung
    // Quelle: https://www.bmf.gv.at/themen/steuern/arbeitnehmerinnenveranlagung/sonderzahlungen.html
    specialPayments: {
      taxRate: 0.06, // 6% Steuersatz für begünstigte Beträge
      freeAmount: 620, // Freibetrag pro Sonderzahlung (Stand 2026)
    },
  },

  /**
   * WECHSELKURSE - Fallback-Werte
   * Stand: Januar 2026 - CHF ist stärker als EUR!
   */
  exchangeRate: {
    defaultCHFtoEUR: 1.07, // Fallback wenn API nicht erreichbar (Stand 2026)
    minValidRate: 0.80,    // Minimaler plausibler Wechselkurs
    maxValidRate: 1.20,    // Maximaler plausibler Wechselkurs
  },
};

/**
 * Hilfsfunktion: Hole Steuersatz für bestimmtes Einkommen
 */
export function getTaxRateForIncome(
  yearlyIncome: number,
  maritalStatus: 'single' | 'married'
): number {
  const brackets = TAX_CONFIG.stGallen[maritalStatus];
  
  for (const bracket of brackets) {
    if (yearlyIncome <= bracket.yearlyIncomeLimit) {
      return bracket.rate;
    }
  }
  
  return brackets[brackets.length - 1].rate;
}

/**
 * Hilfsfunktion: Berechne österreichische Steuer progressiv
 */
export function calculateAustrianTaxProgressive(taxableIncome: number): number {
  let tax = 0;
  let previousLimit = 0;

  for (const bracket of TAX_CONFIG.austria.taxBrackets) {
    if (taxableIncome > previousLimit) {
      const taxableInBracket = Math.min(
        taxableIncome - previousLimit,
        bracket.limit - previousLimit
      );
      tax += taxableInBracket * bracket.rate;
      previousLimit = bracket.limit;
    } else {
      break;
    }
  }

  return tax;
}

/**
 * Hilfsfunktion: Berechne begünstigte Besteuerung für Sonderzahlungen (13./14. Gehalt)
 * @param specialPaymentAmount Betrag der Sonderzahlung (brutto)
 * @returns Berechnete Steuer für diese Sonderzahlung
 */
export function calculateSpecialPaymentTax(specialPaymentAmount: number): number {
  const { taxRate, freeAmount } = TAX_CONFIG.austria.specialPayments;
  
  // Betrag über dem Freibetrag wird mit 6% besteuert
  const taxableAmount = Math.max(0, specialPaymentAmount - freeAmount);
  return taxableAmount * taxRate;
}

/**
 * Hilfsfunktion: Berechne Pendlerpauschale basierend auf km und Zumutbarkeit
 * @param distanceKm Einfache Entfernung in km (eine Richtung)
 * @param publicTransportReasonable Sind öffentliche Verkehrsmittel zumutbar?
 * @returns Monatliche Pendlerpauschale in EUR
 */
export function calculateCommuterAllowance(
  distanceKm: number,
  publicTransportReasonable: boolean
): number {
  if (distanceKm < 2) return 0;

  const brackets = publicTransportReasonable
    ? TAX_CONFIG.austria.commuterAllowance.small
    : TAX_CONFIG.austria.commuterAllowance.large;

  for (const bracket of brackets) {
    if (distanceKm >= bracket.minKm && distanceKm < bracket.maxKm) {
      return Math.round((bracket.yearly / 12) * 100) / 100; // Monatlich
    }
  }

  return 0;
}
