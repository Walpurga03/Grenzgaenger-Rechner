/**
 * Österreichische Einkommensteuer für Grenzgänger
 * Progressionsvorbehalt nach DBA Schweiz-Österreich
 */

import { calculateAustrianTaxProgressive, calculateSpecialPaymentTax } from './taxConfig';

export interface AustrianTaxInput {
  grossIncomeEUR: number;
  salaryMonths: 12 | 13 | 14;    // Anzahl der Gehälter pro Jahr
  commuterAllowance: number;    // Pendlerpauschale
  commuterDistanceKm: number;   // Entfernung für Pendlereuro-Berechnung
  familyBonusPlus: number;      // Familienbonus Plus
  pensionerBonus: number;       // Pensionistenabsetzbetrag
  soleEarnerBonus: number;      // Alleinverdienerabsetzbetrag
  insuranceContribution: number; // Versicherungsbeiträge
  swissSourceTaxEUR: number;    // Schweizer Quellensteuer (Anrechnung)
  // Schweizer Sozialversicherungsbeiträge (steuerlich abzugsfähig in AT)
  swissAHV_ALV_EUR: number;     // AHV + ALV Beiträge
  swissBVG_EUR: number;         // BVG Pensionskasse (Pflichtteil)
  swissKTG_NBU_EUR: number;     // KTG + NBU Versicherungen
}

export interface AustrianTaxResult {
  taxableIncome: number;
  incomeTax: number;
  effectiveRate: number;
  taxAfterBonuses: number;
  taxAfterSwissCredit: number; // Nach Anrechnung CH-Quellensteuer
  netIncomeEUR: number;
}

/**
 * Berechnet die österreichische Einkommensteuer
 * 
 * WICHTIG: Progressionsvorbehalt für Sonderzahlungen!
 * Das 13./14. Gehalt wird zwar nur mit 6% besteuert, erhöht aber den Steuersatz
 * für die laufenden Bezüge. Das Gesamteinkommen bestimmt die Progressionsstufe.
 */
export function calculateAustrianTax(
  input: AustrianTaxInput
): AustrianTaxResult {
  const { 
    grossIncomeEUR, salaryMonths, commuterAllowance, commuterDistanceKm,
    familyBonusPlus, pensionerBonus, soleEarnerBonus,
    insuranceContribution, swissSourceTaxEUR,
    swissAHV_ALV_EUR, swissBVG_EUR, swissKTG_NBU_EUR 
  } = input;
  
  // Laufende Bezüge (immer 12 Monate) - das ist das monatliche Bruttogehalt
  const regularMonthlyIncome = grossIncomeEUR;
  const yearlyRegularIncome = regularMonthlyIncome * 12;

  // Sonderausgaben (vom Einkommen abziehbar)
  const yearlyCommuterAllowance = commuterAllowance * 12;
  const yearlyInsurance = insuranceContribution * 12;
  
  // Werbungskostenpauschale (Standard in Österreich)
  const werbungskostenPauschale = 132; // EUR pro Jahr
  
  // Schweizer Sozialversicherungsbeiträge (steuerlich abzugsfähig als Pflichtbeiträge)
  // WICHTIG: Nur die CH-Abzüge für die LAUFENDEN BEZÜGE (12 Monate) sind hier relevant!
  const yearlySwissSocialSecurityForRegular = (swissAHV_ALV_EUR + swissBVG_EUR + swissKTG_NBU_EUR) * 12;
  
  const totalDeductions = yearlyCommuterAllowance + yearlyInsurance + yearlySwissSocialSecurityForRegular + werbungskostenPauschale;
  
  // Zu versteuerndes Einkommen für laufende Bezüge
  const taxableRegularIncome = Math.max(0, yearlyRegularIncome - totalDeductions);

  // PROGRESSIONSVORBEHALT: Gesamteinkommen inkl. Sonderzahlungen bestimmt den Steuersatz!
  // Das 13./14. Gehalt wird zwar nur mit 6% besteuert, erhöht aber die Progression
  let regularIncomeTax = 0;
  
  if (salaryMonths > 12) {
    // Mit Progressionsvorbehalt: Berechne fiktiven Steuersatz auf Gesamteinkommen
    const sonderzahlungsBrutto = regularMonthlyIncome * (salaryMonths - 12);
    const fiktivesGesamteinkommen = taxableRegularIncome + sonderzahlungsBrutto;
    
    // Berechne Steuer auf fiktives Gesamteinkommen
    const fiktiveSteuer = calculateAustrianTaxProgressive(fiktivesGesamteinkommen);
    
    // Berechne effektiven Steuersatz
    const effektiverSteuersatz = fiktivesGesamteinkommen > 0 ? fiktiveSteuer / fiktivesGesamteinkommen : 0;
    
    // Wende diesen Satz auf die laufenden Bezüge an
    regularIncomeTax = taxableRegularIncome * effektiverSteuersatz;
  } else {
    // Ohne Sonderzahlungen: Standard progressive Steuer
    regularIncomeTax = calculateAustrianTaxProgressive(taxableRegularIncome);
  }

  // Für Transparenz: Gesamtes zu versteuerndes Einkommen (inkl. Sonderzahlungen)
  const taxableIncome = taxableRegularIncome + (salaryMonths - 12) * grossIncomeEUR;

  // Sonderzahlungen (13. und 14. Gehalt) - begünstigte Besteuerung mit 6%
  let specialPaymentsTax = 0;
  if (salaryMonths >= 13) {
    specialPaymentsTax += calculateSpecialPaymentTax(regularMonthlyIncome);
  }
  if (salaryMonths === 14) {
    specialPaymentsTax += calculateSpecialPaymentTax(regularMonthlyIncome);
  }

  // Gesamtsteuer = laufende Bezüge + Sonderzahlungen
  const incomeTax = regularIncomeTax + specialPaymentsTax;

  // Absetzbeträge (von der Steuer abziehbar)
  const yearlyFamilyBonus = familyBonusPlus * 12;
  const yearlyPensionerBonus = pensionerBonus * 12;
  const yearlyPendlerEuro = commuterDistanceKm * 2; // km × 2 EUR pro Jahr
  const yearlySoleEarnerBonus = soleEarnerBonus; // Wird bereits als Jahreswert übergeben
  const totalBonuses = yearlyFamilyBonus + yearlyPensionerBonus + yearlyPendlerEuro + yearlySoleEarnerBonus;
  
  const taxAfterBonuses = Math.max(0, incomeTax - totalBonuses);
  
  // Schweizer Quellensteuer als Vorsteuer anrechnen
  const yearlySwissSourceTax = swissSourceTaxEUR * 12;
  const taxAfterSwissCredit = Math.max(0, taxAfterBonuses - yearlySwissSourceTax);
  
  // Monatliche Werte
  const monthlyTax = taxAfterSwissCredit / 12;
  const totalYearlyIncome = grossIncomeEUR * salaryMonths;
  const effectiveRate = totalYearlyIncome > 0 ? (taxAfterSwissCredit / totalYearlyIncome) : 0;
  const netIncomeEUR = grossIncomeEUR - monthlyTax;

  return {
    taxableIncome,
    incomeTax: incomeTax,
    effectiveRate,
    taxAfterBonuses,
    taxAfterSwissCredit,
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
    salaryMonths: 12,
    commuterAllowance: 0,
    commuterDistanceKm: 0,
    familyBonusPlus: 0,
    pensionerBonus: 0,
    soleEarnerBonus: 0,
    insuranceContribution: 0,
    swissSourceTaxEUR: 0,
    swissAHV_ALV_EUR: 0,
    swissBVG_EUR: 0,
    swissKTG_NBU_EUR: 0,
  });

  const effectiveRate = fictiveTax.effectiveRate;
  
  // Wende diesen Satz nur auf österreichische Einkünfte an
  const taxOnAustrianIncome = austrianIncomeEUR * effectiveRate;

  return {
    effectiveRate,
    taxOnAustrianIncome,
  };
}
