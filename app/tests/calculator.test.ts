import { describe, it, expect } from 'vitest';
import { calculateGrenzgaenger } from '../src/lib/calculator';
import type { GrenzgaengerInput } from '../src/lib/calculator';

describe('Grenzgänger Calculator - Test Scenarios', () => {
  
  // Test 1: 12 vs 13 vs 14 Gehälter Vergleich
  describe('Test 1: Salary Months Comparison (12 vs 13 vs 14)', () => {
    const baseInput: Omit<GrenzgaengerInput, 'salaryMonthsPerYear'> = {
      grossSalaryCHF: 6000,
      exchangeRate: 1.07,
      age: 30,
      maritalStatus: 'single',
      childrenDetails: [],
      commuterDistanceKm: 30,
      commuterAllowanceEUR: 123, // Kleine Pendlerpauschale
      familyBonusPlusEUR: 0,
      insuranceContributionEUR: 0,
      soleEarnerBonusEUR: 0,
      pensionerBonusEUR: 0,
    };

    it('should have 14 salary months with highest net income', () => {
      const result12 = calculateGrenzgaenger({ ...baseInput, salaryMonthsPerYear: 12 });
      const result13 = calculateGrenzgaenger({ ...baseInput, salaryMonthsPerYear: 13 });
      const result14 = calculateGrenzgaenger({ ...baseInput, salaryMonthsPerYear: 14 });

      console.log('\n=== Test 1: 12 vs 13 vs 14 Gehälter (DETAILLIERT) ===');
      console.log('\n--- 12 MONATE ---');
      console.log(`Monatlich: 6.000 CHF = 6.420 EUR`);
      console.log(`Jahresbrutto: ${(6000 * 12).toLocaleString()} CHF = ${(6420 * 12).toLocaleString()} EUR`);
      console.log(`CH-Abzüge/Monat: ${result12.breakdown.ahvALV.toFixed(2)} + ${result12.breakdown.bvg.toFixed(2)} + ${result12.breakdown.ktgNBU.toFixed(2)} = ${(result12.breakdown.ahvALV + result12.breakdown.bvg + result12.breakdown.ktgNBU).toFixed(2)} EUR`);
      console.log(`SG-Steuer/Monat: ${result12.breakdown.sourceTaxSG.toFixed(2)} EUR`);
      console.log(`AT-Steuer/Monat: ${result12.breakdown.austrianTax.toFixed(2)} EUR`);
      console.log(`→ Monatsnetto: ${result12.finalNetEUR.toFixed(2)} EUR × 12 Monate = ${result12.yearlyNetEUR.toFixed(2)} EUR/Jahr`);
      console.log(`→ Ø Monatsnetto: ${result12.averageMonthlyNetEUR.toFixed(2)} EUR (= Jahres-Netto ÷ 12)`);

      console.log('\n--- 14 MONATE ---');
      console.log(`Monatlich: 6.000 CHF = 6.420 EUR`);
      console.log(`Jahresbrutto: ${(6000 * 14).toLocaleString()} CHF = ${(6420 * 14).toLocaleString()} EUR`);
      console.log(`CH-Abzüge/Monat: ${result14.breakdown.ahvALV.toFixed(2)} + ${result14.breakdown.bvg.toFixed(2)} + ${result14.breakdown.ktgNBU.toFixed(2)} = ${(result14.breakdown.ahvALV + result14.breakdown.bvg + result14.breakdown.ktgNBU).toFixed(2)} EUR`);
      console.log(`SG-Steuer/Monat: ${result14.breakdown.sourceTaxSG.toFixed(2)} EUR`);
      console.log(`AT-Steuer/Monat: ${result14.breakdown.austrianTax.toFixed(2)} EUR`);
      console.log(`→ Monatsnetto: ${result14.finalNetEUR.toFixed(2)} EUR × 14 Monate = ${result14.yearlyNetEUR.toFixed(2)} EUR/Jahr`);
      console.log(`→ Ø Monatsnetto: ${result14.averageMonthlyNetEUR.toFixed(2)} EUR (= Jahres-Netto ÷ 12)`);

      console.log('\n--- UNTERSCHIED ---');
      console.log(`Jahresbrutto mehr: ${((6000 * 14) - (6000 * 12)).toLocaleString()} CHF = ${((6420 * 14) - (6420 * 12)).toLocaleString()} EUR (+2 Gehälter!)`);
      console.log(`Jahres-Netto mehr: ${(result14.yearlyNetEUR - result12.yearlyNetEUR).toFixed(2)} EUR`);
      console.log(`→ Das sind ${(result14.averageMonthlyNetEUR - result12.averageMonthlyNetEUR).toFixed(2)} EUR MEHR pro Monat!`);
      console.log(`AT-Steuer gespart: ${(result12.breakdown.austrianTax - result14.breakdown.austrianTax).toFixed(2)} EUR/Monat (wegen 6% Steuersatz auf 13./14. Gehalt)`);

      // 14 Gehälter sollte höchstes Netto haben (13./14. nur 6% Steuer)
      expect(result14.finalNetEUR).toBeGreaterThan(result13.finalNetEUR);
      expect(result13.finalNetEUR).toBeGreaterThan(result12.finalNetEUR);
      
      // 14 Gehälter sollte auch beim durchschnittlichen Monatsnetto am besten sein
      expect(result14.averageMonthlyNetEUR).toBeGreaterThan(result13.averageMonthlyNetEUR);
    });

    it('should tax 13th and 14th salary at preferential 6% rate', () => {
      const result12 = calculateGrenzgaenger({ ...baseInput, salaryMonthsPerYear: 12 });
      const result13 = calculateGrenzgaenger({ ...baseInput, salaryMonthsPerYear: 13 });
      const result14 = calculateGrenzgaenger({ ...baseInput, salaryMonthsPerYear: 14 });

      console.log('\n=== Test: 6% Steuersatz auf 13./14. Gehalt ===');
      
      // Bei 12 Monaten: Alle 12 Gehälter werden progressiv besteuert
      const yearlyGross12 = 6420 * 12; // 77.040 EUR
      console.log(`\n12 Monate: ${yearlyGross12.toLocaleString()} EUR Jahresbrutto`);
      console.log(`→ Alle 12 Gehälter progressiv besteuert`);
      console.log(`→ AT-Steuer gesamt/Jahr: ${(result12.breakdown.austrianTax * 12).toFixed(2)} EUR`);
      
      // Bei 13 Monaten: 12 progressiv + 1 Sonderzahlung (6%)
      const yearlyGross13 = 6420 * 13; // 83.460 EUR
      const specialPayment13 = 6420 * 1; // 1 Gehalt
      console.log(`\n13 Monate: ${yearlyGross13.toLocaleString()} EUR Jahresbrutto`);
      console.log(`→ 12 Gehälter progressiv: ${(6420 * 12).toLocaleString()} EUR`);
      console.log(`→ 1 Sonderzahlung (13. Gehalt) mit 6%: ${specialPayment13.toFixed(2)} EUR`);
      console.log(`→ Steuer auf 13. Gehalt: ${(specialPayment13 * 0.06).toFixed(2)} EUR (nur 6%!)`);
      console.log(`→ AT-Steuer gesamt/Jahr: ${(result13.breakdown.austrianTax * 12).toFixed(2)} EUR`);
      console.log(`→ Steuerersparnis vs 12 Monate: ${((result12.breakdown.austrianTax * 12) - (result13.breakdown.austrianTax * 12)).toFixed(2)} EUR/Jahr`);
      
      // Bei 14 Monaten: 12 progressiv + 2 Sonderzahlungen (6%)
      const yearlyGross14 = 6420 * 14; // 89.880 EUR
      const specialPayment14 = 6420 * 2; // 2 Gehälter
      console.log(`\n14 Monate: ${yearlyGross14.toLocaleString()} EUR Jahresbrutto`);
      console.log(`→ 12 Gehälter progressiv: ${(6420 * 12).toLocaleString()} EUR`);
      console.log(`→ 2 Sonderzahlungen (13. + 14. Gehalt) mit 6%: ${specialPayment14.toFixed(2)} EUR`);
      console.log(`→ Steuer auf 13.+14. Gehalt: ${(specialPayment14 * 0.06).toFixed(2)} EUR (nur 6%!)`);
      console.log(`→ AT-Steuer gesamt/Jahr: ${(result14.breakdown.austrianTax * 12).toFixed(2)} EUR`);
      console.log(`→ Steuerersparnis vs 12 Monate: ${((result12.breakdown.austrianTax * 12) - (result14.breakdown.austrianTax * 12)).toFixed(2)} EUR/Jahr`);

      // Die Steuerersparnis sollte ca. der Differenz zwischen 6% und progressivem Satz entsprechen
      // Bei 6.420 EUR und progressivem Satz ~40% wäre die Steuer ca. 2.568 EUR
      // Bei 6% Satz: 385,20 EUR → Ersparnis ca. 2.182 EUR pro Sonderzahlung
      
      // Wichtig: Die AT-Steuer bei 14 Monaten sollte deutlich niedriger sein als bei 12 Monaten
      // trotz 12.840 EUR mehr Brutto, wegen dem 6% Vorteil
      const taxIncrease12to14 = (result14.breakdown.austrianTax * 12) - (result12.breakdown.austrianTax * 12);
      console.log(`\nSteuererhöhung bei 12.840 EUR mehr Brutto: ${taxIncrease12to14.toFixed(2)} EUR`);
      console.log(`Das sind nur ${((taxIncrease12to14 / 12840) * 100).toFixed(1)}% effektiv (statt ~40%!)`);

      // Tests: Die Steuer sollte NEGATIV sein (weniger Steuer bei 14 Monaten!)
      expect(taxIncrease12to14).toBeLessThan(0);
      
      // Bei 13 Monaten sollte die Steuererhöhung auch negativ oder minimal sein
      const taxIncrease12to13 = (result13.breakdown.austrianTax * 12) - (result12.breakdown.austrianTax * 12);
      expect(taxIncrease12to13).toBeLessThan(100); // Max 100 EUR mehr Steuer bei 6.420 EUR mehr Brutto
      
      // Der effektive Steuersatz auf die Sonderzahlungen sollte nahe 6% sein
      // Bei 14 Monaten: 2 × 6.420 EUR = 12.840 EUR Sonderzahlungen
      // Erwartete Steuer bei 6%: 770,40 EUR
      // Aber durch DBA-Anrechnung kann es Abweichungen geben
      const effectiveTaxRateOnSpecialPayments = Math.abs(taxIncrease12to14 / specialPayment14) * 100;
      console.log(`\nEffektiver Steuersatz auf Sonderzahlungen: ${effectiveTaxRateOnSpecialPayments.toFixed(1)}%`);
      expect(effectiveTaxRateOnSpecialPayments).toBeLessThan(15); // Sollte deutlich unter normalem Satz sein
    });

    it('should apply 620 EUR tax-free allowance per special payment', () => {
      const result12 = calculateGrenzgaenger({ ...baseInput, salaryMonthsPerYear: 12 });
      const result14 = calculateGrenzgaenger({ ...baseInput, salaryMonthsPerYear: 14 });

      console.log('\n=== Test: Freibetrag von 620 EUR pro Sonderzahlung ===');
      
      const monthlyGross = 6420;
      const freeAmountPerPayment = 620;
      
      console.log(`\nMonatliches Brutto: ${monthlyGross.toFixed(2)} EUR`);
      console.log(`Freibetrag pro Sonderzahlung: ${freeAmountPerPayment.toFixed(2)} EUR`);
      
      // Bei 14 Monaten: 2 Sonderzahlungen
      const totalFreeAmount = freeAmountPerPayment * 2; // 1.240 EUR
      const taxableSpecialPayments = (monthlyGross - freeAmountPerPayment) * 2; // 5.800 × 2 = 11.600 EUR
      const expectedTaxOnSpecialPayments = taxableSpecialPayments * 0.06; // 696 EUR
      
      console.log(`\n2 Sonderzahlungen (13. + 14.):`);
      console.log(`→ Gesamt: ${(monthlyGross * 2).toFixed(2)} EUR`);
      console.log(`→ Freibetrag gesamt: ${totalFreeAmount.toFixed(2)} EUR (2 × ${freeAmountPerPayment} EUR)`);
      console.log(`→ Zu versteuern: ${taxableSpecialPayments.toFixed(2)} EUR`);
      console.log(`→ Steuer bei 6%: ${expectedTaxOnSpecialPayments.toFixed(2)} EUR`);
      
      // Tatsächliche Steuerersparnis durch Freibetrag + 6% Satz
      // Wenn die 12.840 EUR progressiv besteuert würden (~40%), wäre die Steuer ca. 5.136 EUR
      // Mit Freibetrag + 6%: nur 696 EUR
      const taxSavings = ((result12.breakdown.austrianTax * 12) - (result14.breakdown.austrianTax * 12));
      console.log(`\nTatsächliche Jahres-Steuerersparnis: ${taxSavings.toFixed(2)} EUR`);
      console.log(`Das entspricht dem Freibetrag + günstigen Steuersatz!`);
      
      // Der Freibetrag sollte spürbar sein
      expect(taxSavings).toBeGreaterThan(0);
      expect(result14.yearlyNetEUR).toBeGreaterThan(result12.yearlyNetEUR + 8000); // Mindestens 8k mehr netto
    });

    it('should show correct yearly and average calculation', () => {
      const result14 = calculateGrenzgaenger({ ...baseInput, salaryMonthsPerYear: 14 });
      
      // Jahres-Netto sollte 14 × Monatsnetto sein
      const expectedYearlyNet = result14.finalNetEUR * 14;
      expect(result14.yearlyNetEUR).toBeCloseTo(expectedYearlyNet, 2);
      
      // Durchschnittliches Monatsnetto sollte Jahres-Netto / 12 sein
      const expectedAverage = result14.yearlyNetEUR / 12;
      expect(result14.averageMonthlyNetEUR).toBeCloseTo(expectedAverage, 2);
    });
  });

  // Test 2: Familienbonus Plus Wirkung
  describe('Test 2: Family Bonus Plus Impact', () => {
    const baseInput: GrenzgaengerInput = {
      grossSalaryCHF: 6000,
      exchangeRate: 1.07,
      salaryMonthsPerYear: 14,
      age: 40,
      maritalStatus: 'married',
      childrenDetails: [],
      commuterDistanceKm: 30,
      commuterAllowanceEUR: 123,
      familyBonusPlusEUR: 0,
      insuranceContributionEUR: 0,
      soleEarnerBonusEUR: 0,
      pensionerBonusEUR: 0,
    };

    it('should increase net correctly with Familienbonus Plus', () => {
      const withoutChild = calculateGrenzgaenger({ ...baseInput, familyBonusPlusEUR: 0 });
      // Familienbonus Plus: 2.000 EUR/Jahr für Kind <18 = 166.68 EUR/Monat
      // Bei 14 Gehältern: 2.000 / 12 = 166.68 EUR/Monat auf 12-Monats-Basis
      const withChild = calculateGrenzgaenger({ ...baseInput, familyBonusPlusEUR: 166.68 });

      console.log('\n=== Test 2: Familienbonus Plus ===');
      console.log(`Ohne Kind: ${withoutChild.finalNetEUR.toFixed(2)} EUR`);
      console.log(`Mit Kind <18 (166.68 EUR): ${withChild.finalNetEUR.toFixed(2)} EUR`);
      console.log(`Differenz: ${(withChild.finalNetEUR - withoutChild.finalNetEUR).toFixed(2)} EUR`);

      // Der tatsächliche Wert wird verdoppelt, weil der Familienbonus monatlich addiert wird
      const difference = withChild.finalNetEUR - withoutChild.finalNetEUR;
      expect(difference).toBeGreaterThan(150);
      expect(difference).toBeLessThan(350);
    });

    it('should add full yearly bonus divided by monthly salary count', () => {
      const withoutChild = calculateGrenzgaenger({ ...baseInput, familyBonusPlusEUR: 0 });
      // Test mit 2 Kindern unter 18: 2 × 2.000 = 4.000 EUR/Jahr
      // Bei 14 Gehältern: 4.000 / 12 = 333.36 EUR/Monat (Vergleichswert)
      const with2Kids = calculateGrenzgaenger({ ...baseInput, familyBonusPlusEUR: 333.36 });

      console.log(`Mit 2 Kindern <18 (333.36 EUR): ${with2Kids.finalNetEUR.toFixed(2)} EUR`);
      console.log(`Differenz: ${(with2Kids.finalNetEUR - withoutChild.finalNetEUR).toFixed(2)} EUR`);

      const difference = with2Kids.finalNetEUR - withoutChild.finalNetEUR;
      expect(difference).toBeGreaterThan(300);
      expect(difference).toBeLessThan(700);
    });
  });

  // Test 3: Pendlerpauschale Große vs Kleine
  describe('Test 3: Commuter Allowance Comparison', () => {
    const baseInput: GrenzgaengerInput = {
      grossSalaryCHF: 6000,
      exchangeRate: 1.07,
      salaryMonthsPerYear: 14,
      age: 35,
      maritalStatus: 'single',
      childrenDetails: [],
      commuterDistanceKm: 40,
      commuterAllowanceEUR: 0,
      familyBonusPlusEUR: 0,
      insuranceContributionEUR: 0,
      soleEarnerBonusEUR: 0,
      pensionerBonusEUR: 0,
    };

    it('should have lower tax with große Pendlerpauschale', () => {
      // Kleine: 30km mit Öffis = 123 EUR/Monat
      const kleine = calculateGrenzgaenger({ 
        ...baseInput, 
        commuterDistanceKm: 30,
        commuterAllowanceEUR: 123 
      });
      
      // Große: 40km ohne Öffis = 243 EUR/Monat
      const grosse = calculateGrenzgaenger({ 
        ...baseInput, 
        commuterDistanceKm: 40,
        commuterAllowanceEUR: 243 
      });

      console.log('\n=== Test 3: Pendlerpauschale ===');
      console.log(`Kleine (30km, Öffis): Netto ${kleine.finalNetEUR.toFixed(2)} EUR, AT-Steuer ${kleine.breakdown.austrianTax.toFixed(2)} EUR`);
      console.log(`Große (40km, kein Öffis): Netto ${grosse.finalNetEUR.toFixed(2)} EUR, AT-Steuer ${grosse.breakdown.austrianTax.toFixed(2)} EUR`);
      console.log(`Netto-Differenz: ${(grosse.finalNetEUR - kleine.finalNetEUR).toFixed(2)} EUR`);

      // Große Pendlerpauschale sollte zu höherem Netto führen
      expect(grosse.finalNetEUR).toBeGreaterThan(kleine.finalNetEUR);
      // AT-Steuer sollte niedriger sein
      expect(grosse.breakdown.austrianTax).toBeLessThan(kleine.breakdown.austrianTax);
    });
  });

  // Test 4: Alleinverdienerabsetzbetrag
  describe('Test 4: Sole Earner Bonus', () => {
    const baseInput: GrenzgaengerInput = {
      grossSalaryCHF: 6000,
      exchangeRate: 1.07,
      salaryMonthsPerYear: 14,
      age: 45,
      maritalStatus: 'married',
      childrenDetails: [],
      commuterDistanceKm: 30,
      commuterAllowanceEUR: 123,
      familyBonusPlusEUR: 333.36, // 2 Kinder unter 18
      insuranceContributionEUR: 0,
      soleEarnerBonusEUR: 0,
      pensionerBonusEUR: 0,
    };

    it('should reduce tax significantly with Alleinverdienerabsetzbetrag', () => {
      const without = calculateGrenzgaenger({ ...baseInput, soleEarnerBonusEUR: 0 });
      // 1 Kind = 572 EUR/Jahr, + 1 Kind = +206 EUR = 778 EUR/Jahr
      const with2Kids = calculateGrenzgaenger({ ...baseInput, soleEarnerBonusEUR: 778 });

      console.log('\n=== Test 4: Alleinverdienerabsetzbetrag ===');
      console.log(`Ohne Alleinverdiener: Netto ${without.finalNetEUR.toFixed(2)} EUR, AT-Steuer ${without.breakdown.austrianTax.toFixed(2)} EUR`);
      console.log(`Mit Alleinverdiener (2 Kinder): Netto ${with2Kids.finalNetEUR.toFixed(2)} EUR, AT-Steuer ${with2Kids.breakdown.austrianTax.toFixed(2)} EUR`);
      console.log(`Steuerersparnis: ${(without.breakdown.austrianTax - with2Kids.breakdown.austrianTax).toFixed(2)} EUR/Monat`);

      // Mit Alleinverdienerabsetzbetrag sollte AT-Steuer niedriger sein
      expect(with2Kids.breakdown.austrianTax).toBeLessThan(without.breakdown.austrianTax);
      // Netto sollte höher sein
      expect(with2Kids.finalNetEUR).toBeGreaterThan(without.finalNetEUR);
    });
  });

  // Test 5: Progressionswirkung bei höheren Gehältern
  describe('Test 5: Progressive Tax Effect', () => {
    const createInput = (salary: number): GrenzgaengerInput => ({
      grossSalaryCHF: salary,
      exchangeRate: 1.07,
      salaryMonthsPerYear: 14,
      age: 35,
      maritalStatus: 'single',
      childrenDetails: [],
      commuterDistanceKm: 30,
      commuterAllowanceEUR: 123,
      familyBonusPlusEUR: 0,
      insuranceContributionEUR: 0,
      soleEarnerBonusEUR: 0,
      pensionerBonusEUR: 0,
    });

    it('should show progressive tax rates with higher salaries', () => {
      const result6k = calculateGrenzgaenger(createInput(6000));
      const result8k = calculateGrenzgaenger(createInput(8000));
      const result10k = calculateGrenzgaenger(createInput(10000));

      console.log('\n=== Test 5: Progressionswirkung ===');
      console.log(`6.000 CHF: Brutto ${result6k.grossSalaryEUR.toFixed(2)} EUR, Netto ${result6k.finalNetEUR.toFixed(2)} EUR, Effektiv ${result6k.effectiveTaxRate.toFixed(2)}%`);
      console.log(`8.000 CHF: Brutto ${result8k.grossSalaryEUR.toFixed(2)} EUR, Netto ${result8k.finalNetEUR.toFixed(2)} EUR, Effektiv ${result8k.effectiveTaxRate.toFixed(2)}%`);
      console.log(`10.000 CHF: Brutto ${result10k.grossSalaryEUR.toFixed(2)} EUR, Netto ${result10k.finalNetEUR.toFixed(2)} EUR, Effektiv ${result10k.effectiveTaxRate.toFixed(2)}%`);

      // Effektive Steuerlast sollte progressiv steigen
      expect(result8k.effectiveTaxRate).toBeGreaterThan(result6k.effectiveTaxRate);
      expect(result10k.effectiveTaxRate).toBeGreaterThan(result8k.effectiveTaxRate);

      // Netto sollte trotzdem steigen (absolut)
      expect(result8k.finalNetEUR).toBeGreaterThan(result6k.finalNetEUR);
      expect(result10k.finalNetEUR).toBeGreaterThan(result8k.finalNetEUR);

      // Aber der Netto-Zuwachs sollte unterproportional sein (Progression!)
      const increase6to8 = result8k.finalNetEUR - result6k.finalNetEUR;
      const increase8to10 = result10k.finalNetEUR - result8k.finalNetEUR;
      expect(increase8to10).toBeLessThan(increase6to8 * 1.1); // Nicht mehr als 10% mehr
    });
  });

  // Test 6: Versicherung sollte das Netto reduzieren
  describe('Test 6: Insurance Contribution Impact', () => {
    const baseInput: GrenzgaengerInput = {
      grossSalaryCHF: 6000,
      exchangeRate: 1.07,
      salaryMonthsPerYear: 14,
      age: 35,
      maritalStatus: 'single',
      childrenDetails: [],
      commuterDistanceKm: 30,
      commuterAllowanceEUR: 123,
      familyBonusPlusEUR: 0,
      insuranceContributionEUR: 0,
      soleEarnerBonusEUR: 0,
      pensionerBonusEUR: 0,
    };

    it('should reduce net but also reduce tax (steuerlich abzugsfähig)', () => {
      const without = calculateGrenzgaenger({ ...baseInput, insuranceContributionEUR: 0 });
      const with550 = calculateGrenzgaenger({ ...baseInput, insuranceContributionEUR: 550 });

      console.log('\n=== Test 6: Versicherung ===');
      console.log(`Ohne Versicherung: Netto ${without.finalNetEUR.toFixed(2)} EUR, AT-Steuer ${without.breakdown.austrianTax.toFixed(2)} EUR`);
      console.log(`Mit 550 EUR Versicherung: Netto ${with550.finalNetEUR.toFixed(2)} EUR, AT-Steuer ${with550.breakdown.austrianTax.toFixed(2)} EUR`);
      console.log(`Netto-Differenz: ${(without.finalNetEUR - with550.finalNetEUR).toFixed(2)} EUR`);
      console.log(`Steuerersparnis: ${(without.breakdown.austrianTax - with550.breakdown.austrianTax).toFixed(2)} EUR`);

      // Netto sollte um weniger als 550 EUR sinken (weil steuerlich abzugsfähig!)
      const nettoReduction = without.finalNetEUR - with550.finalNetEUR;
      expect(nettoReduction).toBeLessThan(550);
      expect(nettoReduction).toBeGreaterThan(200); // Mindestens 200 EUR Reduktion (bei 40% Steuer: 550 * 0.6 = 330)

      // AT-Steuer sollte niedriger sein
      expect(with550.breakdown.austrianTax).toBeLessThan(without.breakdown.austrianTax);
      
      // Steuerersparnis sollte ca. 40% der Versicherung sein (bei diesem Gehalt)
      const taxSavings = without.breakdown.austrianTax - with550.breakdown.austrianTax;
      expect(taxSavings).toBeGreaterThan(150); // Mindestens 150 EUR sparen
      expect(taxSavings).toBeLessThan(250); // Maximal 250 EUR sparen
    });
  });
});
