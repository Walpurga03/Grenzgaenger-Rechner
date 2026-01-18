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
 */
export function calculateGrenzgaenger(
  input: GrenzgaengerInput
): GrenzgaengerResult {
  const { grossSalaryCHF, salaryMonthsPerYear } = input;
  
  // Jahresbruttolohn berechnen
  const yearlyGrossCHF = grossSalaryCHF * salaryMonthsPerYear;

  // 1. Schweizer Sozialversicherungsabzüge
  // WICHTIG: Für das tatsächliche Netto verwenden wir das echte Monatsgehalt, NICHT den Durchschnitt!
  const swissDeductionsActual = calculateSwissDeductions({
    grossSalaryCHF: grossSalaryCHF, // Tatsächliches Monatsgehalt
    yearlyGrossCHF,
    age: input.age,
  });

  // 2. Quellensteuer St. Gallen (basierend auf Bruttolohn)
  const stGallenTax = calculateStGallenTax({
    grossSalaryCHF: grossSalaryCHF,
    maritalStatus: input.maritalStatus,
    children: input.childrenDetails.length,
  });

  // 3. In EUR umrechnen (tatsächliche Werte)
  const grossInEUR = convertCHFtoEUR(grossSalaryCHF, input.exchangeRate);
  const sourceTaxEUR = convertCHFtoEUR(stGallenTax.sourceTax, input.exchangeRate);
  
  // Schweizer Abzüge in EUR (diese sind real bezahlt!)
  const swissDeductionsEUR = convertCHFtoEUR(swissDeductionsActual.totalDeductions, input.exchangeRate).amountEUR;

  // Für österreichische Steuer: Tatsächliches Monatsgehalt (nicht Durchschnitt)
  const actualMonthlySalaryCHF = grossSalaryCHF;
  const actualMonthlySalaryEUR = convertCHFtoEUR(actualMonthlySalaryCHF, input.exchangeRate);

  // Schweizer Sozialversicherungsbeiträge in EUR umrechnen (steuerlich abzugsfähig in AT)
  const swissAHV_ALV_EUR = convertCHFtoEUR(swissDeductionsActual.ahv + swissDeductionsActual.alv, input.exchangeRate).amountEUR;
  const swissBVG_EUR = convertCHFtoEUR(swissDeductionsActual.bvg, input.exchangeRate).amountEUR;
  const swissKTG_NBU_EUR = convertCHFtoEUR(swissDeductionsActual.ktg + swissDeductionsActual.nbu, input.exchangeRate).amountEUR;

  // 4. Österreichische Steuer berechnen
  // Die Schweizer Quellensteuer wird als Vorsteuer angerechnet
  // Versicherungsbeiträge sind Sonderausgaben
  // Schweizer Sozialversicherungen sind steuerlich abzugsfähig
  const austrianTaxCalc = calculateAustrianTax({
    grossIncomeEUR: actualMonthlySalaryEUR.amountEUR,
    salaryMonths: salaryMonthsPerYear,
    commuterAllowance: input.commuterAllowanceEUR,
    commuterDistanceKm: input.commuterDistanceKm,
    familyBonusPlus: input.familyBonusPlusEUR,
    pensionerBonus: input.pensionerBonusEUR,
    soleEarnerBonus: input.soleEarnerBonusEUR,
    insuranceContribution: input.insuranceContributionEUR,
    swissSourceTaxEUR: sourceTaxEUR.amountEUR,
    swissAHV_ALV_EUR,
    swissBVG_EUR,
    swissKTG_NBU_EUR,
  });

  // Monatliche österreichische Steuer (nach Anrechnung CH-Quellensteuer durch DBA)
  const austrianTaxMonthly = austrianTaxCalc.taxAfterSwissCredit / 12;
  
  // 5. Finales Nettoeinkommen - KORREKTE Berechnung:
  // Die Schweizer Quellensteuer wird durch das DBA in AT angerechnet.
  // Das bedeutet: CH-Quellensteuer ist NICHT vom Netto abzuziehen!
  // 
  // Rechnung:
  // Brutto EUR
  // - Schweizer SV-Abzüge (AHV/ALV/BVG/KTG/NBU) → real bezahlt in CH
  // - Österreichische Steuer → schon MIT DBA-Anrechnung der CH-Quellensteuer!
  // - Versicherung (AT)
  // + Familienbonus
  const finalNetEUR = grossInEUR.amountEUR 
    - swissDeductionsEUR 
    - austrianTaxMonthly 
    - input.insuranceContributionEUR 
    + input.familyBonusPlusEUR;

  // WICHTIG: Jahres-Netto und Durchschnitt berechnen
  // Bei 12 Monaten: 12 Gehälter × finalNetEUR
  // Bei 13 Monaten: 13 Gehälter × finalNetEUR
  // Bei 14 Monaten: 14 Gehälter × finalNetEUR
  const yearlyNetEUR = finalNetEUR * salaryMonthsPerYear;
  
  // Durchschnittliches monatliches Netto (auf 12 Monate umgerechnet für Vergleichbarkeit)
  const averageMonthlyNetEUR = yearlyNetEUR / 12;

  // Gesamte Steuerlast
  const totalTaxBurden = swissDeductionsActual.totalDeductions + stGallenTax.sourceTax;
  const totalTaxBurdenEUR = convertCHFtoEUR(totalTaxBurden, input.exchangeRate).amountEUR;
  
  const effectiveTaxRate = (totalTaxBurdenEUR / grossInEUR.amountEUR) * 100;

  return {
    grossSalaryCHF: grossSalaryCHF, // Tatsächlicher Monatslohn
    swissDeductions: swissDeductionsActual.totalDeductions,
    netAfterDeductionsCHF: swissDeductionsActual.netSalaryCHF,
    sourceTaxCHF: stGallenTax.sourceTax,
    netAfterTaxCHF: stGallenTax.netAfterTax,
    
    grossSalaryEUR: grossInEUR.amountEUR, // Tatsächlicher Monatslohn in EUR
    netAfterTaxEUR: grossInEUR.amountEUR - swissDeductionsEUR - sourceTaxEUR.amountEUR, // Netto nach CH-Abzügen
    
    austrianTaxLiabilityEUR: austrianTaxMonthly, // Tatsächliche monatliche AT-Steuerlast
    austrianTaxCalculated: austrianTaxMonthly,
    
    finalNetEUR, // Monatsnetto bei DIESEM Gehältermodell (z.B. bei 14 Monaten = 1/14 des Jahres)
    yearlyNetEUR, // Jahres-Netto total
    averageMonthlyNetEUR, // Durchschnittliches monatliches Netto (auf 12 Monate umgerechnet)
    totalTaxBurden: totalTaxBurdenEUR,
    effectiveTaxRate,
    
    breakdown: {
      ahvALV: convertCHFtoEUR(swissDeductionsActual.ahv + swissDeductionsActual.alv, input.exchangeRate).amountEUR,
      bvg: convertCHFtoEUR(swissDeductionsActual.bvg, input.exchangeRate).amountEUR,
      ktgNBU: convertCHFtoEUR(swissDeductionsActual.ktg + swissDeductionsActual.nbu, input.exchangeRate).amountEUR,
      sourceTaxSG: sourceTaxEUR.amountEUR,
      austrianTax: austrianTaxMonthly,
      commuterAllowance: input.commuterAllowanceEUR,
      familyBonus: input.familyBonusPlusEUR,
      insuranceContribution: input.insuranceContributionEUR,
    },
  };
}
