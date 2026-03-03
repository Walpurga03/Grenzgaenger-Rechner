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
  
  // Konfigurierbare Schweizer Sozialversicherungssätze (optional, Defaults aus TAX_CONFIG)
  ahvRate?: number;        // AHV-Beitragssatz (Standard: 5.3%)
  alvRate?: number;        // ALV-Beitragssatz (Standard: 1.1%)
  bvgRate?: number;        // BVG-Beitragssatz (Standard: 7%)
  ktgRate?: number;        // KTG-Beitragssatz (Standard: 1.4%)
  nbuRate?: number;        // NBU-Beitragssatz (Standard: 1%)
  
  // Konfigurierbare Quellensteuer (optional, sonst automatisch berechnet)
  manualSourceTaxCHF?: number;  // Manuelle Quellensteuer pro Monat (CHF)
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
  
  // DBA-Anrechnung (4,5%-Kappung) - NEU!
  creditableSourceTaxEUR: number;      // Anrechenbare Quellensteuer (max. 4,5%)
  nonCreditableSourceTaxEUR: number;   // Nicht anrechenbare Steuer (Verlust)
  taxLeakagePercent: number;           // Verlust in Prozent vom Brutto
  
  // Finale Werte
  finalNetEUR: number; // Monatsnetto bei DIESEM Gehältermodell
  yearlyNetEUR: number; // Jahres-Netto (finalNetEUR × Anzahl Gehälter)
  averageMonthlyNetEUR: number; // Durchschnitt auf 12 Monate (yearlyNetEUR / 12)
  totalTaxBurden: number;
  effectiveTaxRate: number;
  
  // Kennzahlen für AT-Steuererklärung (Formular L1i) - NEU!
  taxDeclarationData: {
    kennzahl701: number;  // Bruttobezüge (EUR/Jahr)
    kennzahl721: number;  // SV-Beiträge (EUR/Jahr)
    kennzahl377: number;  // Anrechenbare ausländische Steuer (EUR/Jahr)
    kennzahl374: number;  // Nicht anrechenbare Steuer (EUR/Jahr)
    kennzahl770: number;  // Steuerpflichtiges Einkommen (EUR/Jahr)
  };
  
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
    // Optionale benutzerdefinierte Raten weitergeben
    ahvRate: input.ahvRate,
    alvRate: input.alvRate,
    bvgRate: input.bvgRate,
    ktgRate: input.ktgRate,
    nbuRate: input.nbuRate,
  });

  // 2b) St. Gallen Quellensteuer (pro Monat)
  // Verwende manuelle Quellensteuer, falls angegeben, sonst automatisch berechnen
  let monthlySourceTaxCHF: number;
  
  if (input.manualSourceTaxCHF !== undefined && input.manualSourceTaxCHF !== null) {
    // Manuelle Quellensteuer verwenden
    monthlySourceTaxCHF = input.manualSourceTaxCHF;
  } else {
    // Automatisch berechnen
    const stGallenTax = calculateStGallenTax({
      grossSalaryCHF: grossSalaryCHF,
      maritalStatus: input.maritalStatus,
      children: input.childrenDetails.length,
    });
    monthlySourceTaxCHF = stGallenTax.sourceTax;
  }

  // Jahreswerte der Schweizer Abzüge
  const yearlySwissSocialSecurityCHF = swissDeductions.totalDeductions * salaryMonthsPerYear;
  const yearlySourceTaxCHF = monthlySourceTaxCHF * 12; // Quellensteuer nur auf 12 Monate

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
  // DBA-ANRECHNUNG UND KENNZAHLEN
  // ========================================
  // Kennzahlen für AT-Steuererklärung (Formular L1i)
  const taxDeclarationData = {
    kennzahl701: yearlyGrossEUR,                                    // Bruttobezüge (EUR/Jahr)
    kennzahl721: yearlySwissSocialSecurityEUR,                      // SV-Beiträge (EUR/Jahr)
    kennzahl377: austrianTaxCalc.creditableSourceTax,               // Anrechenbare Steuer (EUR/Jahr)
    kennzahl374: austrianTaxCalc.nonCreditableSourceTax,            // Nicht anrechenbare Steuer (EUR/Jahr)
    kennzahl770: yearlyGrossEUR - yearlySwissSocialSecurityEUR,     // Steuerpflichtiges Einkommen (EUR/Jahr)
  };

  // ========================================
  // RÜCKGABEWERTE
  // ========================================
  return {
    // Schweiz (monatliche Anzeige-Werte)
    grossSalaryCHF: monthlyGrossCHF,
    swissDeductions: swissDeductions.totalDeductions,
    netAfterDeductionsCHF: swissDeductions.netSalaryCHF,
    sourceTaxCHF: monthlySourceTaxCHF,
    netAfterTaxCHF: swissDeductions.netSalaryCHF - monthlySourceTaxCHF,
    
    // Umrechnung (monatliche Werte)
    grossSalaryEUR: monthlyGrossEUR,
    netAfterTaxEUR: monthlyGrossEUR - (yearlySwissSocialSecurityEUR / salaryMonthsPerYear) - (yearlySourceTaxEUR / 12),
    
    // Österreich (monatliche Werte)
    austrianTaxLiabilityEUR: monthlyAustrianTaxEUR,
    austrianTaxCalculated: monthlyAustrianTaxEUR,
    
    // DBA-Anrechnung (4,5%-Kappung) - NEU!
    creditableSourceTaxEUR: austrianTaxCalc.creditableSourceTax,
    nonCreditableSourceTaxEUR: austrianTaxCalc.nonCreditableSourceTax,
    taxLeakagePercent: austrianTaxCalc.taxLeakagePercent,
    
    // Finale Netto-Werte
    finalNetEUR, // Monatsnetto bei diesem Gehältermodell
    yearlyNetEUR, // Jahres-Netto gesamt
    averageMonthlyNetEUR, // Durchschnitt auf 12 Monate
    totalTaxBurden: monthlyTotalTaxBurden,
    effectiveTaxRate,
    
    // Kennzahlen für AT-Steuererklärung - NEU!
    taxDeclarationData,
    
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
