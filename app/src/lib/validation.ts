/**
 * Validierungsregeln für Eingabefelder
 */

export interface ValidationRule {
  min?: number;
  max?: number;
  required?: boolean;
  integer?: boolean;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export const validationRules: Record<string, ValidationRule> = {
  grossSalary: {
    min: 1000,
    max: 50000,
    required: true,
    message: 'Bruttolohn muss zwischen CHF 1\'000 und CHF 50\'000 liegen',
  },
  age: {
    min: 18,
    max: 67,
    required: true,
    integer: true,
    message: 'Alter muss zwischen 18 und 67 Jahren liegen',
  },
  exchangeRate: {
    min: 0.5,
    max: 1.5,
    required: true,
    message: 'Wechselkurs muss zwischen 0.50 und 1.50 liegen',
  },
  commuterDistanceKm: {
    min: 0,
    max: 999,
    required: true,
    integer: true,
    message: 'Distanz muss zwischen 0 und 999 km liegen',
  },
  insuranceContribution: {
    min: 0,
    max: 5000,
    required: false,
    message: 'Versicherungsbeitrag muss zwischen EUR 0 und EUR 5\'000 liegen',
  },
};

/**
 * Validiert einen einzelnen Wert gegen eine Regel
 */
export function validateField(
  value: number,
  rule: ValidationRule
): ValidationError | null {
  // Required check
  if (rule.required && (value === undefined || value === null || isNaN(value))) {
    return {
      field: 'value',
      message: rule.message || 'Dieses Feld ist erforderlich',
    };
  }

  // Integer check
  if (rule.integer && !Number.isInteger(value)) {
    return {
      field: 'value',
      message: 'Bitte geben Sie eine ganze Zahl ein',
    };
  }

  // Min check
  if (rule.min !== undefined && value < rule.min) {
    return {
      field: 'value',
      message: rule.message || `Wert muss mindestens ${rule.min} sein`,
    };
  }

  // Max check
  if (rule.max !== undefined && value > rule.max) {
    return {
      field: 'value',
      message: rule.message || `Wert darf maximal ${rule.max} sein`,
    };
  }

  return null;
}

/**
 * Validiert mehrere Felder gleichzeitig
 */
export function validateFields(
  values: Record<string, number>
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [fieldName, value] of Object.entries(values)) {
    const rule = validationRules[fieldName];
    if (rule) {
      const error = validateField(value, rule);
      if (error) {
        errors.push({
          field: fieldName,
          message: error.message,
        });
      }
    }
  }

  return errors;
}

/**
 * Prüft ob ein Wert gültig ist (boolean shorthand)
 */
export function isValid(value: number, fieldName: string): boolean {
  const rule = validationRules[fieldName];
  if (!rule) return true;
  
  return validateField(value, rule) === null;
}
