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

      console.log('\n=== Test 1: 12 vs 13 vs 14 Gehälter ===');
      console.log(`12 Gehälter - Netto: ${result12.finalNetEUR.toFixed(2)} EUR`);
      console.log(`13 Gehälter - Netto: ${result13.finalNetEUR.toFixed(2)} EUR`);
      console.log(`14 Gehälter - Netto: ${result14.finalNetEUR.toFixed(2)} EUR`);
      console.log(`AT-Steuer 12: ${result12.breakdown.austrianTax.toFixed(2)} EUR`);
      console.log(`AT-Steuer 13: ${result13.breakdown.austrianTax.toFixed(2)} EUR`);
      console.log(`AT-Steuer 14: ${result14.breakdown.austrianTax.toFixed(2)} EUR`);

      // 14 Gehälter sollte höchstes Netto haben (13./14. nur 6% Steuer)
      expect(result14.finalNetEUR).toBeGreaterThan(result13.finalNetEUR);
      expect(result13.finalNetEUR).toBeGreaterThan(result12.finalNetEUR);
      
      // 14 Gehälter sollte auch beim österreichischen Vergleich am besten sein
      expect(result14.finalNetEURAustrianComparison).toBeGreaterThan(result13.finalNetEURAustrianComparison);
    });

    it('should show correct 14-salary average', () => {
      const result14 = calculateGrenzgaenger({ ...baseInput, salaryMonthsPerYear: 14 });
      
      // Der österreichische Vergleichswert sollte das 12-Monats-Netto / 14 * 12 sein
      const expectedAustrianComparison = (result14.finalNetEUR * 12) / 14;
      
      expect(result14.finalNetEURAustrianComparison).toBeCloseTo(expectedAustrianComparison, 2);
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
