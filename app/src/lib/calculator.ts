/**
 * Hauptberechnungslogik für Grenzgänger SG-AT
 * Kombiniert alle Teilberechnungen
 */

import { calculateSwissDeductions } from './swiss-deductions';
import { calculateStGallenTax } from './st-gallen-tax';
import { calculateAustrianTax } from './austrian-tax';
import { convertCHFtoEUR } from './currency';
import { type ChildDetails } from '@/types/calculator';

export interface GrenzgaengerInput {
  // Schweizer Einkommen
  grossSalaryCHF: number;
  salaryMonthsPerYear: 12 | 13 | 14;
  age: number;
  
  // Persönliche Daten
  maritalStatus: 'single' | 'married';
  childrenDetails: ChildDetails[];
  
  // Österreichische Pauschalen
  commuterDistanceKm: number;   // Entfernung für Pendlerpauschale und Pendlereuro
  commuterAllowanceEUR: number;
  familyBonusPlusEUR: number;
  soleEarnerBonusEUR: number;   // Alleinverdienerabsetzbetrag
  pensionerBonusEUR: number;
  insuranceContributionEUR: number;
  
  // Wechselkurs
  exchangeRate: number;
}

export interface GrenzgaengerResult {
  // Schweiz
  grossSalaryCHF: number;
  swissDeductions: number;
  netAfterDeductionsCHF: number;
  sourceTaxCHF: number;
  netAfterTaxCHF: number;
  
  // Umrechnung
  grossSalaryEUR: number;
  netAfterTaxEUR: number;
  
  // Österreich
  austrianTaxLiabilityEUR: number;
  austrianTaxCalculated: number; // Theoretische AT-Steuer (für Transparenz)
  
  // Finale Werte
  finalNetEUR: number; // Monatsnetto bei DIESEM Gehältermodell
  yearlyNetEUR: number; // Jahres-Netto (finalNetEUR × Anzahl Gehälter)
  averageMonthlyNetEUR: number; // Durchschnitt auf 12 Monate (yearlyNetEUR / 12)
  totalTaxBurden: number;
  effectiveTaxRate: number;
  
  // Details für Visualisierung
  breakdown: {
    ahvALV: number;
    bvg: number;
    ktgNBU: number;
    sourceTaxSG: number;
    austrianTax: number;
    commuterAllowance: number;
    familyBonus: number;
    insuranceContribution: number;
  };
}

/**
 * Hauptberechnungsfunktion
 * 
 * BERECHNUNGSLOGIK (ausgehend vom Jahresbrutto):
 * 1. Jahresbrutto (CHF) = Monatsgehalt × Anzahl Gehälter (12/13/14)
 * 2. Schweizer Abzüge berechnen (Sozialversicherungen + Quellensteuer)
 * 3. In EUR umrechnen (ZUERST!)
 * 4. Österreichische Steuer mit:
 *    - DBA-Anrechnung der Quellensteuer
 *    - 6% Besteuerung für 13./14. Gehalt (wenn separat ausgezahlt) mit 620€ Freibetrag pro Zahlung
 *    - Pendlerpauschale und Pendlereuro
 *    - Familienbonus Plus
 *    - Alleinverdienerabsetzbetrag
 * 5. Versicherungen abziehen
 * 6. Netto berechnen (Jahreswert → Durchschnitt pro Monat)
 */
export function calculateGrenzgaenger(
  input: GrenzgaengerInput
): GrenzgaengerResult {
  const { grossSalaryCHF, salaryMonthsPerYear, exchangeRate } = input;
  
  // ========================================
  // SCHRITT 1: JAHRESBRUTTO BERECHNEN (CHF)
  // ========================================
  const yearlyGrossCHF = grossSalaryCHF * salaryMonthsPerYear;

  // ========================================
  // SCHRITT 2: SCHWEIZER ABZÜGE (CHF)
  // ========================================
  // 2a) Sozialversicherungen (AHV, ALV, BVG, KTG, NBU)
  const swissDeductions = calculateSwissDeductions({
    grossSalaryCHF: grossSalaryCHF,
    yearlyGrossCHF,
    age: input.age,
  });

  // 2b) St. Gallen Quellensteuer (pro Monat)
  const stGallenTax = calculateStGallenTax({
    grossSalaryCHF: grossSalaryCHF,
    maritalStatus: input.maritalStatus,
    children: input.childrenDetails.length,
  });

  // Jahreswerte der Schweizer Abzüge
  const yearlySwissSocialSecurityCHF = swissDeductions.totalDeductions * salaryMonthsPerYear;
  const yearlySourceTaxCHF = stGallenTax.sourceTax * 12; // Quellensteuer nur auf 12 Monate

  // ========================================
  // SCHRITT 3: IN EUR UMRECHNEN (ZUERST!)
  // ========================================
  const yearlyGrossEUR = convertCHFtoEUR(yearlyGrossCHF, exchangeRate).amountEUR;
  const yearlySwissSocialSecurityEUR = convertCHFtoEUR(yearlySwissSocialSecurityCHF, exchangeRate).amountEUR;
  const yearlySourceTaxEUR = convertCHFtoEUR(yearlySourceTaxCHF, exchangeRate).amountEUR;
  
  // Monatswerte für Anzeige
  const monthlyGrossCHF = grossSalaryCHF;
  const monthlyGrossEUR = convertCHFtoEUR(monthlyGrossCHF, exchangeRate).amountEUR;

  // Schweizer Sozialversicherungsbeiträge aufgeschlüsselt (für AT-Steuer)
  const swissAHV_ALV_EUR = convertCHFtoEUR((swissDeductions.ahv + swissDeductions.alv) * salaryMonthsPerYear, exchangeRate).amountEUR;
  const swissBVG_EUR = convertCHFtoEUR(swissDeductions.bvg * salaryMonthsPerYear, exchangeRate).amountEUR;
  const swissKTG_NBU_EUR = convertCHFtoEUR((swissDeductions.ktg + swissDeductions.nbu) * salaryMonthsPerYear, exchangeRate).amountEUR;

  // ========================================
  // SCHRITT 4: ÖSTERREICHISCHE STEUER (EUR)
  // ========================================
  const austrianTaxCalc = calculateAustrianTax({
    grossIncomeEUR: monthlyGrossEUR, // Monatliches Bruttogehalt
    salaryMonths: salaryMonthsPerYear,
    commuterAllowance: input.commuterAllowanceEUR,
    commuterDistanceKm: input.commuterDistanceKm,
    familyBonusPlus: input.familyBonusPlusEUR,
    pensionerBonus: input.pensionerBonusEUR,
    soleEarnerBonus: input.soleEarnerBonusEUR,
    insuranceContribution: input.insuranceContributionEUR,
    swissSourceTaxEUR: yearlySourceTaxEUR / 12, // Monatlich für AT-Berechnung
    swissAHV_ALV_EUR: swissAHV_ALV_EUR / salaryMonthsPerYear, // Pro Gehalt
    swissBVG_EUR: swissBVG_EUR / salaryMonthsPerYear,
    swissKTG_NBU_EUR: swissKTG_NBU_EUR / salaryMonthsPerYear,
  });

  // Jährliche österreichische Steuer (nach Anrechnung der CH-Quellensteuer durch DBA)
  const yearlyAustrianTaxEUR = austrianTaxCalc.taxAfterSwissCredit;
  const monthlyAustrianTaxEUR = yearlyAustrianTaxEUR / 12;

  // ========================================
  // SCHRITT 5: VERSICHERUNGEN (EUR, jährlich)
  // ========================================
  const yearlyInsuranceEUR = input.insuranceContributionEUR * 12;

  // ========================================
  // SCHRITT 6: NETTO BERECHNEN (EUR)
  // ========================================
  // Jahres-Netto:
  // + Jahresbrutto (EUR)
  // - Schweizer Sozialversicherungen (EUR) [real bezahlt in CH]
  // - Schweizer Quellensteuer (EUR) [real bezahlt in CH, wird aber in AT angerechnet!]
  // - Österreichische Steuer (EUR) [nachzahlen in AT, NACH DBA-Anrechnung der CH-Quellensteuer]
  // - Versicherungen (EUR) [real bezahlt]
  // + Familienbonus (EUR, jährlich) [bereits in AT-Steuer berücksichtigt]
  const yearlyFamilyBonusEUR = input.familyBonusPlusEUR * 12;
  
  const yearlyNetEUR = yearlyGrossEUR 
    - yearlySwissSocialSecurityEUR 
    - yearlySourceTaxEUR  // WICHTIG: CH-Quellensteuer muss abgezogen werden!
    - yearlyAustrianTaxEUR 
    - yearlyInsuranceEUR 
    + yearlyFamilyBonusEUR;
  
  // Durchschnittliches monatliches Netto (auf 12 Monate verteilt für Vergleichbarkeit)
  const averageMonthlyNetEUR = yearlyNetEUR / 12;
  
  // Monatsnetto bei diesem Gehältermodell (für Anzeige)
  const finalNetEUR = yearlyNetEUR / salaryMonthsPerYear;

  // ========================================
  // STEUERLAST UND EFFEKTIVER STEUERSATZ
  // ========================================
  // Gesamte Abzüge (CHF): Sozialversicherungen + Quellensteuer
  const totalDeductionsCHF = yearlySwissSocialSecurityCHF + yearlySourceTaxCHF;
  const totalDeductionsEUR = convertCHFtoEUR(totalDeductionsCHF, exchangeRate).amountEUR;
  
  // Gesamte Steuerlast pro Monat (für Breakdown)
  const monthlyTotalTaxBurden = totalDeductionsEUR / 12;
  
  const effectiveTaxRate = yearlyGrossEUR > 0 ? (totalDeductionsEUR / yearlyGrossEUR) * 100 : 0;

  // ========================================
  // RÜCKGABEWERTE
  // ========================================
  return {
    // Schweiz (monatliche Anzeige-Werte)
    grossSalaryCHF: monthlyGrossCHF,
    swissDeductions: swissDeductions.totalDeductions,
    netAfterDeductionsCHF: swissDeductions.netSalaryCHF,
    sourceTaxCHF: stGallenTax.sourceTax,
    netAfterTaxCHF: stGallenTax.netAfterTax,
    
    // Umrechnung (monatliche Werte)
    grossSalaryEUR: monthlyGrossEUR,
    netAfterTaxEUR: monthlyGrossEUR - (yearlySwissSocialSecurityEUR / salaryMonthsPerYear) - (yearlySourceTaxEUR / 12),
    
    // Österreich (monatliche Werte)
    austrianTaxLiabilityEUR: monthlyAustrianTaxEUR,
    austrianTaxCalculated: monthlyAustrianTaxEUR,
    
    // Finale Netto-Werte
    finalNetEUR, // Monatsnetto bei diesem Gehältermodell
    yearlyNetEUR, // Jahres-Netto gesamt
    averageMonthlyNetEUR, // Durchschnitt auf 12 Monate
    totalTaxBurden: monthlyTotalTaxBurden,
    effectiveTaxRate,
    
    // Breakdown (monatliche Werte für Visualisierung)
    breakdown: {
      ahvALV: convertCHFtoEUR(swissDeductions.ahv + swissDeductions.alv, exchangeRate).amountEUR,
      bvg: convertCHFtoEUR(swissDeductions.bvg, exchangeRate).amountEUR,
      ktgNBU: convertCHFtoEUR(swissDeductions.ktg + swissDeductions.nbu, exchangeRate).amountEUR,
      sourceTaxSG: yearlySourceTaxEUR / 12,
      austrianTax: monthlyAustrianTaxEUR,
      commuterAllowance: input.commuterAllowanceEUR,
      familyBonus: input.familyBonusPlusEUR,
      insuranceContribution: input.insuranceContributionEUR,
    },
  };
}
