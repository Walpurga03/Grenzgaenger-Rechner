/**
 * Zentrale Konfiguration für alle Steuersätze und Abzüge
 * Hier können alle Prozentsätze einfach angepasst werden
 * 
 * Stand: 2026
 */

export const TAX_CONFIG = {
  /**
   * SCHWEIZER SOZIALVERSICHERUNGEN
   */
  switzerland: {
    // AHV/IV/EO - Alters- und Hinterlassenenversicherung
    ahv: {
      rate: 0.053, // 5.3% Arbeitnehmeranteil
      description: 'AHV/IV/EO (Arbeitnehmeranteil)',
    },

    // ALV - Arbeitslosenversicherung
    alv: {
      baseRate: 0.011, // 1.1% bis Limite
      additionalRate: 0.005, // 0.5% über Limite
      yearlyLimit: 148200, // CHF jährlich
      description: 'Arbeitslosenversicherung',
    },

    // BVG - Berufliche Vorsorge (Pensionskasse)
    bvg: {
      rate: 0.07, // 7% (Durchschnitt, kann variieren)
      minAge: 18, // Ab 18 Jahren
      minYearlySalary: 22050, // CHF jährlich
      description: 'Berufliche Vorsorge (Pensionskasse)',
    },

    // KTG - Krankentaggeldversicherung
    ktg: {
      rate: 0.014, // 1.4%
      description: 'Krankentaggeldversicherung',
    },

    // NBU - Nichtberufsunfallversicherung
    nbu: {
      rate: 0.01, // 1%
      description: 'Nichtberufsunfallversicherung',
    },
  },

  /**
   * ST. GALLEN QUELLENSTEUER
   * Vereinfachte progressive Steuersätze
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

    // Pensionistenabsetzbetrag
    pensionerBonus: {
      maxYearly: 825, // EUR maximal pro Jahr
    },
  },

  /**
   * WECHSELKURSE - Fallback-Werte
   */
  exchangeRate: {
    defaultCHFtoEUR: 0.95, // Fallback wenn API nicht erreichbar
    minValidRate: 0.85,    // Minimaler plausibler Wechselkurs
    maxValidRate: 1.05,    // Maximaler plausibler Wechselkurs
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
