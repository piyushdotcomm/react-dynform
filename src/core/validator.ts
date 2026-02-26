import type { ValidationRule, ValidationResult, FormErrors } from '../types/validation.js';
import type { FieldSchema, FormValues } from '../types/schema.js';

// ─────────────────────────────────────────────
// Built-in Validation Engine
// ─────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate a single field value against its rules.
 */
export function validateField(
    field: FieldSchema,
    value: unknown,
    allValues: FormValues
): ValidationResult {
    const errors: string[] = [];
    const rules = field.validation ?? [];

    // If field has required shorthand and no explicit rule, add it
    const hasRequiredRule = rules.some((r) => r.rule === 'required');
    if (field.required && !hasRequiredRule) {
        rules.unshift({ rule: 'required', message: `${field.label} is required.` });
    }

    for (const rule of rules) {
        const error = applyRule(rule, value, allValues);
        if (error) {
            errors.push(error);
        }
    }

    return { valid: errors.length === 0, errors };
}

function applyRule(
    rule: ValidationRule,
    value: unknown,
    allValues: FormValues
): string | null {
    switch (rule.rule) {
        case 'required': {
            if (isEmpty(value)) return rule.message;
            return null;
        }

        case 'minLength': {
            if (typeof value === 'string' && value.length < rule.value) {
                return rule.message;
            }
            return null;
        }

        case 'maxLength': {
            if (typeof value === 'string' && value.length > rule.value) {
                return rule.message;
            }
            return null;
        }

        case 'min': {
            if (typeof value === 'number' && value < rule.value) {
                return rule.message;
            }
            return null;
        }

        case 'max': {
            if (typeof value === 'number' && value > rule.value) {
                return rule.message;
            }
            return null;
        }

        case 'pattern': {
            const regex = new RegExp(rule.value);
            if (typeof value === 'string' && !regex.test(value)) {
                return rule.message;
            }
            return null;
        }

        case 'email': {
            if (typeof value === 'string' && value.length > 0 && !EMAIL_REGEX.test(value)) {
                return rule.message;
            }
            return null;
        }

        case 'custom': {
            if (!rule.validate(value, allValues)) {
                return rule.message;
            }
            return null;
        }

        default:
            return null;
    }
}

function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'boolean') return false; // checkboxes: false is a valid value
    return false;
}

/**
 * Validate all fields in the form at once.
 * Returns a map of fieldId -> error array. Empty means valid.
 */
export function validateForm(
    fields: FieldSchema[],
    values: FormValues,
    visibleFields: Set<string>
): FormErrors {
    const errors: FormErrors = {};

    for (const field of fields) {
        // Skip validation for hidden/invisible fields
        if (!visibleFields.has(field.id)) continue;

        const value = values[field.id];
        const result = validateField(field, value, values);
        if (!result.valid) {
            errors[field.id] = result.errors;
        }
    }

    return errors;
}

/**
 * Validate only the fields in a specific step.
 */
export function validateStep(
    stepFields: FieldSchema[],
    values: FormValues,
    visibleFields: Set<string>
): FormErrors {
    return validateForm(stepFields, values, visibleFields);
}

/**
 * Check if a FormErrors map has any errors.
 */
export function hasErrors(errors: FormErrors): boolean {
    return Object.keys(errors).some((key) => (errors[key]?.length ?? 0) > 0);
}
