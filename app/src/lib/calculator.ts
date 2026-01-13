/**
 * Hauptberechnungslogik für Grenzgänger SG-AT
 * Kombiniert alle Teilberechnungen
 */

import { calculateSwissDeductions } from './swiss-deductions';
import { calculateStGallenTax } from './st-gallen-tax';
import { calculateAustrianTax } from './austrian-tax';
import { convertCHFtoEUR } from './currency';

export interface GrenzgaengerInput {
  // Schweizer Einkommen
  grossSalaryCHF: number;
  bonus13thSalary: boolean;
  age: number;
  
  // Persönliche Daten
  maritalStatus: 'single' | 'married';
  children: number;
  
  // Österreichische Pauschalen
  commuterAllowanceEUR: number;
  familyBonusPlusEUR: number;
  pensionerBonusEUR: number;
  
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
  
  // Finale Werte
  finalNetEUR: number;
  totalTaxBurden: number;
  effectiveTaxRate: number;
  
  // Details für Visualisierung
  breakdown: {
    ahvALV: number;
    bvg: number;
    ktgNBU: number;
    sourceTaxSG: number;
    austrianTax: number;
  };
}

/**
 * Hauptberechnungsfunktion
 */
export function calculateGrenzgaenger(
  input: GrenzgaengerInput
): GrenzgaengerResult {
  let { grossSalaryCHF } = input;
  
  // 13. Monatslohn berücksichtigen
  if (input.bonus13thSalary) {
    grossSalaryCHF = grossSalaryCHF * 13 / 12;
  }

  // 1. Schweizer Sozialversicherungsabzüge
  const swissDeductions = calculateSwissDeductions({
    grossSalaryCHF,
    age: input.age,
  });

  // 2. Quellensteuer St. Gallen
  const stGallenTax = calculateStGallenTax({
    netSalaryCHF: swissDeductions.netSalaryCHF,
    maritalStatus: input.maritalStatus,
    children: input.children,
  });

  // 3. In EUR umrechnen
  const grossInEUR = convertCHFtoEUR(grossSalaryCHF, input.exchangeRate);
  const netInEUR = convertCHFtoEUR(stGallenTax.netAfterTax, input.exchangeRate);

  // 4. Österreichische Steuer (informativ, da Progressionsvorbehalt)
  const austrianTax = calculateAustrianTax({
    grossIncomeEUR: grossInEUR.amountEUR,
    commuterAllowance: input.commuterAllowanceEUR,
    familyBonusPlus: input.familyBonusPlusEUR,
    pensionerBonus: input.pensionerBonusEUR,
  });

  // Da Einkommen aus CH in AT steuerfrei ist (DBA), aber Progressionsvorbehalt gilt
  // Für reine CH-Grenzgänger ohne weitere AT-Einkünfte: keine zusätzliche AT-Steuer
  const austrianTaxLiabilityEUR = 0;

  // Finales Nettoeinkommen
  const finalNetEUR = netInEUR.amountEUR - austrianTaxLiabilityEUR;

  // Gesamte Steuerlast
  const sourceTaxEUR = convertCHFtoEUR(stGallenTax.sourceTax, input.exchangeRate).amountEUR;
  const totalTaxBurden = swissDeductions.totalDeductions + stGallenTax.sourceTax;
  const totalTaxBurdenEUR = convertCHFtoEUR(totalTaxBurden, input.exchangeRate).amountEUR;
  
  const effectiveTaxRate = (totalTaxBurdenEUR / grossInEUR.amountEUR) * 100;

  return {
    grossSalaryCHF,
    swissDeductions: swissDeductions.totalDeductions,
    netAfterDeductionsCHF: swissDeductions.netSalaryCHF,
    sourceTaxCHF: stGallenTax.sourceTax,
    netAfterTaxCHF: stGallenTax.netAfterTax,
    
    grossSalaryEUR: grossInEUR.amountEUR,
    netAfterTaxEUR: netInEUR.amountEUR,
    
    austrianTaxLiabilityEUR,
    
    finalNetEUR,
    totalTaxBurden: totalTaxBurdenEUR,
    effectiveTaxRate,
    
    breakdown: {
      ahvALV: convertCHFtoEUR(swissDeductions.ahv + swissDeductions.alv, input.exchangeRate).amountEUR,
      bvg: convertCHFtoEUR(swissDeductions.bvg, input.exchangeRate).amountEUR,
      ktgNBU: convertCHFtoEUR(swissDeductions.ktg + swissDeductions.nbu, input.exchangeRate).amountEUR,
      sourceTaxSG: sourceTaxEUR,
      austrianTax: austrianTaxLiabilityEUR,
    },
  };
}
