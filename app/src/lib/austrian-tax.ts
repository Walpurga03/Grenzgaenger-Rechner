/**
 * Österreichische Einkommensteuer für Grenzgänger
 * Progressionsvorbehalt nach DBA Schweiz-Österreich
 */

export interface AustrianTaxInput {
  grossIncomeEUR: number;
  commuterAllowance: number;    // Pendlerpauschale
  familyBonusPlus: number;      // Familienbonus Plus
  pensionerBonus: number;       // Pensionistenabsetzbetrag
}

export interface AustrianTaxResult {
  taxableIncome: number;
  incomeTax: number;
  effectiveRate: number;
  taxAfterBonuses: number;
  netIncomeEUR: number;
}

/**
 * Österreichische Einkommensteuertarife 2026
 * Progressive Steuersätze
 */
const TAX_BRACKETS = [
  { limit: 12816, rate: 0.00 },      // Steuerfrei
  { limit: 20818, rate: 0.20 },      // 20%
  { limit: 34513, rate: 0.30 },      // 30%
  { limit: 66612, rate: 0.40 },      // 40%
  { limit: 99266, rate: 0.48 },      // 48%
  { limit: Infinity, rate: 0.50 },   // 50%
];

/**
 * Berechnet die österreichische Einkommensteuer
 */
export function calculateAustrianTax(
  input: AustrianTaxInput
): AustrianTaxResult {
  const { grossIncomeEUR, commuterAllowance, familyBonusPlus, pensionerBonus } = input;
  
  // Jahreseinkommen
  const yearlyIncome = grossIncomeEUR * 12;

  // Abzüge
  const totalAllowances = (commuterAllowance * 12);
  const taxableIncome = Math.max(0, yearlyIncome - totalAllowances);

  // Progressive Steuerberechnung
  let incomeTax = 0;
  let previousLimit = 0;

  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome > previousLimit) {
      const taxableInBracket = Math.min(
        taxableIncome - previousLimit,
        bracket.limit - previousLimit
      );
      incomeTax += taxableInBracket * bracket.rate;
      previousLimit = bracket.limit;
    } else {
      break;
    }
  }

  // Absetzbeträge (Boni) abziehen
  const yearlyFamilyBonus = familyBonusPlus * 12;
  const yearlyPensionerBonus = pensionerBonus * 12;
  const totalBonuses = yearlyFamilyBonus + yearlyPensionerBonus;
  
  const taxAfterBonuses = Math.max(0, incomeTax - totalBonuses);
  
  // Monatliche Werte
  const monthlyTax = taxAfterBonuses / 12;
  const effectiveRate = taxableIncome > 0 ? (taxAfterBonuses / yearlyIncome) : 0;
  const netIncomeEUR = grossIncomeEUR - monthlyTax;

  return {
    taxableIncome,
    incomeTax: incomeTax,
    effectiveRate,
    taxAfterBonuses,
    netIncomeEUR,
  };
}

/**
 * Progressionsvorbehalt für in Österreich wohnhafte Grenzgänger
 * Die Schweizer Einkünfte sind in AT steuerfrei, erhöhen aber den Steuersatz
 * für andere österreichische Einkünfte
 */
export function calculateProgressionReserve(
  swissIncomeEUR: number,
  austrianIncomeEUR: number = 0
): { effectiveRate: number; taxOnAustrianIncome: number } {
  const totalIncome = swissIncomeEUR + austrianIncomeEUR;
  
  // Berechne fiktiven Steuersatz auf Gesamteinkommen
  const fictiveTax = calculateAustrianTax({
    grossIncomeEUR: totalIncome / 12,
    commuterAllowance: 0,
    familyBonusPlus: 0,
    pensionerBonus: 0,
  });

  const effectiveRate = fictiveTax.effectiveRate;
  
  // Wende diesen Satz nur auf österreichische Einkünfte an
  const taxOnAustrianIncome = austrianIncomeEUR * effectiveRate;

  return {
    effectiveRate,
    taxOnAustrianIncome,
  };
}
