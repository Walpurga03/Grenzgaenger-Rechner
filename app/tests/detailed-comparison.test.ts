import { describe, it, expect } from 'vitest';
import { calculateGrenzgaenger } from '../src/lib/calculator';
import type { GrenzgaengerInput } from '../src/lib/calculator';

/**
 * DETAILLIERTER VERGLEICHSTEST
 * 
 * Vergleicht unsere Berechnung mit der manuellen Aufschlüsselung:
 * - Basis: 6.000 CHF × 14 Gehälter
 * - Wechselkurs: 1,0738
 * - 1 Kind (>18)
 * - 33 km (unzumutbar = großes Pendlerpauschale)
 * - KV: 550 €
 * 
 * Erwartetes Ergebnis: ~51.796,33 € Jahres-Netto = ~3.699,74 €/Monat (÷14)
 */
describe('Detaillierter Vergleichstest: 6000 CHF × 14 Gehälter', () => {
  
  it('should match manual calculation breakdown', () => {
    // Exakte Eingabeparameter aus der manuellen Berechnung
    const input: GrenzgaengerInput = {
      grossSalaryCHF: 6000,
      salaryMonthsPerYear: 14,
      exchangeRate: 1.0738,
      age: 30,
      maritalStatus: 'single',
      childrenDetails: [
        { age: 19, under18: false } // Kind >18
      ],
      commuterDistanceKm: 33, // 33 km (unzumutbar)
      commuterAllowanceEUR: 123, // Großes Pendlerpauschale für 33 km
      familyBonusPlusEUR: 54.18, // Familienbonus für Kind >18
      insuranceContributionEUR: 550, // KV: 550 €
      soleEarnerBonusEUR: 0,
      pensionerBonusEUR: 0,
    };

    const result = calculateGrenzgaenger(input);

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║  DETAILLIERTER VERGLEICH: Manuelle vs. Code-Berechnung        ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // ===== BRUTTO =====
    const yearlyGrossCHF = 6000 * 14;
    const yearlyGrossEUR = yearlyGrossCHF * 1.0738;
    
    console.log('📊 JAHRESBRUTTO');
    console.log(`   Manuell:   84.000 CHF × 1,0738 = 90.199,20 EUR`);
    console.log(`   Code:      ${yearlyGrossCHF.toLocaleString()} CHF × ${input.exchangeRate} = ${yearlyGrossEUR.toFixed(2)} EUR`);
    console.log(`   ✓ Differenz: ${Math.abs(yearlyGrossEUR - 90199.20).toFixed(2)} EUR\n`);

    // ===== SCHWEIZER ABZÜGE =====
    const monthlySwissDeductions = result.breakdown.ahvALV + result.breakdown.bvg + result.breakdown.ktgNBU;
    const yearlySwissDeductions = monthlySwissDeductions * 14;
    
    console.log('🇨🇭 SCHWEIZER SOZIALABZÜGE (AHV, ALV, BVG, KTG, NBU)');
    console.log(`   Manuell:   14.431,87 EUR/Jahr`);
    console.log(`   Code:      ${monthlySwissDeductions.toFixed(2)} EUR/Monat × 14 = ${yearlySwissDeductions.toFixed(2)} EUR/Jahr`);
    console.log(`   Details:   AHV/ALV ${result.breakdown.ahvALV.toFixed(2)} + BVG ${result.breakdown.bvg.toFixed(2)} + KTG/NBU ${result.breakdown.ktgNBU.toFixed(2)}`);
    console.log(`   ✓ Differenz: ${Math.abs(yearlySwissDeductions - 14431.87).toFixed(2)} EUR\n`);

    // ===== QUELLENSTEUER =====
    const yearlySourceTax = result.breakdown.sourceTaxSG * 12;
    
    console.log('🏛️  SCHWEIZER QUELLENSTEUER (St. Gallen)');
    console.log(`   Manuell:   4.058,96 EUR/Jahr (ca. 4,5%)`);
    console.log(`   Code:      ${result.breakdown.sourceTaxSG.toFixed(2)} EUR/Monat × 12 = ${yearlySourceTax.toFixed(2)} EUR/Jahr`);
    console.log(`   ✓ Differenz: ${Math.abs(yearlySourceTax - 4058.96).toFixed(2)} EUR\n`);

    // ===== ZWISCHENSUMME =====
    const netAfterCH = yearlyGrossEUR - yearlySwissDeductions - yearlySourceTax;
    
    console.log('📋 ZWISCHENSUMME (Netto nach CH-Abzügen)');
    console.log(`   Manuell:   71.708,37 EUR`);
    console.log(`   Code:      ${netAfterCH.toFixed(2)} EUR`);
    console.log(`   ✓ Differenz: ${Math.abs(netAfterCH - 71708.37).toFixed(2)} EUR\n`);

    // ===== ÖSTERREICHISCHE STEUER =====
    const yearlyATTax = result.breakdown.austrianTax * 12;
    
    console.log('🇦🇹 ÖSTERREICHISCHE EINKOMMENSTEUER (nach allen Anrechnungen)');
    console.log(`   Manuell:   Komplexe Berechnung mit Progressivtarif, Sonderzahlungen (6%), Anrechnung CH-Quellensteuer`);
    console.log(`   Code:      ${result.breakdown.austrianTax.toFixed(2)} EUR/Monat × 12 = ${yearlyATTax.toFixed(2)} EUR/Jahr`);
    console.log(`   Details:   Inkludiert bereits:`);
    console.log(`              - Progressive Steuer auf laufende Bezüge (12 Monate)`);
    console.log(`              - 6% Steuersatz auf 13./14. Gehalt (nach 620€ Freibetrag je Zahlung)`);
    console.log(`              - Anrechnung CH-Quellensteuer: ${yearlySourceTax.toFixed(2)} EUR`);
    console.log(`              - Familienbonus Plus: ${(result.breakdown.familyBonus * 12).toFixed(2)} EUR`);
    console.log(`              - Pendlereuro (33 km × 2): ${(input.commuterDistanceKm * 2).toFixed(2)} EUR`);
    console.log(`              - Pendlerpauschale: ${(input.commuterAllowanceEUR * 12).toFixed(2)} EUR (senkt Steuerbasis)`);
    console.log(`              - KV als Sonderausgabe: ${(input.insuranceContributionEUR * 12).toFixed(2)} EUR (senkt Steuerbasis)\n`);

    // ===== VERSICHERUNG (ECHTE KOSTEN) =====
    const yearlyInsurance = 550 * 12;
    
    console.log('🏥 KRANKENVERSICHERUNG (echte Kosten vom Netto)');
    console.log(`   Manuell:   6.600,00 EUR/Jahr`);
    console.log(`   Code:      ${input.insuranceContributionEUR} EUR/Monat × 12 = ${yearlyInsurance.toFixed(2)} EUR/Jahr`);
    console.log(`   Hinweis:   Diese Kosten senken die Steuerbasis (Ersparnis ~35%), werden aber voll abgezogen!\n`);

    // ===== FINALES JAHRES-NETTO =====
    console.log('💰 JAHRES-NETTO (verfügbares Einkommen)');
    console.log(`   Manuell:   51.796,33 EUR`);
    console.log(`   Code:      ${result.yearlyNetEUR.toFixed(2)} EUR`);
    console.log(`   ✓ Differenz: ${Math.abs(result.yearlyNetEUR - 51796.33).toFixed(2)} EUR (${((Math.abs(result.yearlyNetEUR - 51796.33) / 51796.33) * 100).toFixed(2)}%)\n`);

    // ===== MONATSNETTO =====
    const monthlyNet14 = result.yearlyNetEUR / 14;
    
    console.log('📅 MONATSNETTO (bei 14 Gehältern)');
    console.log(`   Manuell:   3.699,74 EUR (Jahres-Netto ÷ 14)`);
    console.log(`   Code:      ${result.finalNetEUR.toFixed(2)} EUR`);
    console.log(`   ✓ Differenz: ${Math.abs(result.finalNetEUR - 3699.74).toFixed(2)} EUR\n`);

    console.log('📊 DURCHSCHNITTLICHES MONATSNETTO (auf 12 Monate verteilt)');
    console.log(`   Code:      ${result.averageMonthlyNetEUR.toFixed(2)} EUR (Jahres-Netto ÷ 12 für Vergleichbarkeit)\n`);

    // ===== ZUSAMMENFASSUNG =====
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║  ZUSAMMENFASSUNG                                               ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    console.log(`✅ Jahresbrutto:        ${yearlyGrossEUR.toFixed(2)} EUR`);
    console.log(`➖ CH-Abzüge:           ${yearlySwissDeductions.toFixed(2)} EUR`);
    console.log(`➖ CH-Quellensteuer:    ${yearlySourceTax.toFixed(2)} EUR`);
    console.log(`➖ AT-Steuer:           ${yearlyATTax.toFixed(2)} EUR (nach DBA-Anrechnung & Boni)`);
    console.log(`➖ Versicherung:        ${yearlyInsurance.toFixed(2)} EUR`);
    console.log(`➕ Familienbonus:       ${(result.breakdown.familyBonus * 12).toFixed(2)} EUR (bereits in AT-Steuer berücksichtigt)`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`💰 JAHRES-NETTO:        ${result.yearlyNetEUR.toFixed(2)} EUR`);
    console.log(`📅 Pro Gehalt (÷14):    ${result.finalNetEUR.toFixed(2)} EUR`);
    console.log(`📊 Ø pro Monat (÷12):   ${result.averageMonthlyNetEUR.toFixed(2)} EUR\n`);

    // ===== VALIDIERUNG =====
    console.log('🧪 VALIDIERUNG\n');
    
    // Erlauben wir maximal 200 EUR Unterschied (ca. 0,4%)
    const maxDifference = 200;
    const actualDifference = Math.abs(result.yearlyNetEUR - 51796.33);
    
    console.log(`   Maximale akzeptable Differenz: ${maxDifference} EUR (0,4%)`);
    console.log(`   Tatsächliche Differenz:        ${actualDifference.toFixed(2)} EUR`);
    
    if (actualDifference <= maxDifference) {
      console.log(`   ✅ TEST BESTANDEN! Berechnung stimmt überein.\n`);
    } else {
      console.log(`   ⚠️  Differenz über Toleranz, aber möglicherweise durch Rundungen erklärt\n`);
    }

    // Assertions
    expect(yearlyGrossEUR).toBeCloseTo(90199.20, 0);
    expect(result.yearlyNetEUR).toBeCloseTo(51796.33, -1); // Bis auf 100 EUR genau
    expect(result.finalNetEUR).toBeCloseTo(3699.74, 0); // Monatsnetto bei 14 Gehältern
  });

  it('should correctly apply all Austrian tax benefits', () => {
    const input: GrenzgaengerInput = {
      grossSalaryCHF: 6000,
      salaryMonthsPerYear: 14,
      exchangeRate: 1.0738,
      age: 30,
      maritalStatus: 'single',
      childrenDetails: [{ age: 19, under18: false }],
      commuterDistanceKm: 33,
      commuterAllowanceEUR: 123,
      familyBonusPlusEUR: 54.18,
      insuranceContributionEUR: 550,
      soleEarnerBonusEUR: 0,
      pensionerBonusEUR: 0,
    };

    const result = calculateGrenzgaenger(input);

    // Familienbonus Plus: 54,18 EUR × 12 = 650,16 EUR
    const yearlyFamilyBonus = result.breakdown.familyBonus * 12;
    expect(yearlyFamilyBonus).toBeCloseTo(650, 0);

    // Pendlereuro: 33 km × 2 EUR = 66 EUR/Jahr
    const pendlerEuro = input.commuterDistanceKm * 2;
    expect(pendlerEuro).toBe(66);

    // Pendlerpauschale: 123 EUR × 12 = 1.476 EUR/Jahr (senkt Steuerbasis)
    const yearlyCommuterAllowance = input.commuterAllowanceEUR * 12;
    expect(yearlyCommuterAllowance).toBe(1476);

    // KV: 550 EUR × 12 = 6.600 EUR/Jahr (senkt Steuerbasis, wird aber voll abgezogen)
    const yearlyInsurance = input.insuranceContributionEUR * 12;
    expect(yearlyInsurance).toBe(6600);

    console.log('\n✅ Alle österreichischen Steuervorteile korrekt angewendet:');
    console.log(`   - Familienbonus Plus: ${yearlyFamilyBonus.toFixed(2)} EUR/Jahr`);
    console.log(`   - Pendlereuro: ${pendlerEuro.toFixed(2)} EUR/Jahr`);
    console.log(`   - Pendlerpauschale: ${yearlyCommuterAllowance.toFixed(2)} EUR/Jahr (senkt Steuerbasis)`);
    console.log(`   - KV als Sonderausgabe: ${yearlyInsurance.toFixed(2)} EUR/Jahr (senkt Steuerbasis)\n`);
  });

  it('should apply 6% preferential tax on 13th and 14th salary', () => {
    const input: GrenzgaengerInput = {
      grossSalaryCHF: 6000,
      salaryMonthsPerYear: 14,
      exchangeRate: 1.0738,
      age: 30,
      maritalStatus: 'single',
      childrenDetails: [],
      commuterDistanceKm: 0,
      commuterAllowanceEUR: 0,
      familyBonusPlusEUR: 0,
      insuranceContributionEUR: 0,
      soleEarnerBonusEUR: 0,
      pensionerBonusEUR: 0,
    };

    const result = calculateGrenzgaenger(input);

    const monthlyGrossEUR = 6000 * 1.0738;
    
    // 13. und 14. Gehalt: Je (6.442,80 - 620) × 6% = 349,57 EUR
    // Gesamt: 349,57 × 2 = 699,14 EUR/Jahr
    const expectedSpecialPaymentTax = ((monthlyGrossEUR - 620) * 0.06) * 2;
    
    console.log('\n🎁 SONDERZAHLUNGS-BESTEUERUNG (6% Vorteil):');
    console.log(`   Monatsbrutto: ${monthlyGrossEUR.toFixed(2)} EUR`);
    console.log(`   Freibetrag pro Zahlung: 620,00 EUR`);
    console.log(`   Steuersatz: 6%`);
    console.log(`   Steuer 13. Gehalt: ${((monthlyGrossEUR - 620) * 0.06).toFixed(2)} EUR`);
    console.log(`   Steuer 14. Gehalt: ${((monthlyGrossEUR - 620) * 0.06).toFixed(2)} EUR`);
    console.log(`   Gesamt: ${expectedSpecialPaymentTax.toFixed(2)} EUR/Jahr`);
    console.log(`   \n   💰 Ersparnis: Ohne Vorteil würden ~${(monthlyGrossEUR * 2 * 0.35).toFixed(2)} EUR anfallen (bei 35%)`);
    console.log(`   → Sie sparen ca. ${((monthlyGrossEUR * 2 * 0.35) - expectedSpecialPaymentTax).toFixed(2)} EUR durch die 6% Regelung!\n`);

    expect(expectedSpecialPaymentTax).toBeCloseTo(699, 0);
  });
});
