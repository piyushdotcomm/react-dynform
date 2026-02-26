import type { FieldCondition, FieldSchema, FormValues } from '../types/schema.js';

// ─────────────────────────────────────────────
// Condition Engine
// Determines which fields are visible
// ─────────────────────────────────────────────

/**
 * Evaluate a single field condition against current form values.
 * Returns true if the field SHOULD be shown.
 */
export function evaluateCondition(
    condition: FieldCondition,
    values: FormValues
): boolean {
    const fieldValue = values[condition.field];
    const operator = condition.operator ?? 'equals';
    const compareValue = condition.equals !== undefined ? condition.equals : condition.value;

    switch (operator) {
        case 'equals':
            return fieldValue === compareValue;

        case 'notEquals':
            return fieldValue !== compareValue;

        case 'contains': {
            if (typeof fieldValue === 'string' && typeof compareValue === 'string') {
                return fieldValue.includes(compareValue);
            }
            if (Array.isArray(fieldValue)) {
                return fieldValue.includes(compareValue);
            }
            return false;
        }

        case 'greaterThan': {
            if (typeof fieldValue === 'number' && typeof compareValue === 'number') {
                return fieldValue > compareValue;
            }
            return false;
        }

        case 'lessThan': {
            if (typeof fieldValue === 'number' && typeof compareValue === 'number') {
                return fieldValue < compareValue;
            }
            return false;
        }

        case 'exists':
            return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';

        default:
            return true;
    }
}

/**
 * Compute which fields are currently visible based on their conditions.
 * Fields with no condition are always visible (unless schema hides them).
 * Returns a Set of visible field IDs.
 */
export function computeVisibility(
    fields: FieldSchema[],
    values: FormValues
): Set<string> {
    const visible = new Set<string>();

    for (const field of fields) {
        if (field.hidden) continue;

        if (!field.condition) {
            visible.add(field.id);
            continue;
        }

        if (evaluateCondition(field.condition, values)) {
            visible.add(field.id);
        }
    }

    return visible;
}

/**
 * When a field is hidden, its value should be cleared to avoid
 * submitting stale data. Returns cleaned values.
 */
export function clearHiddenFieldValues(
    fields: FieldSchema[],
    values: FormValues,
    visibleFields: Set<string>
): FormValues {
    const cleaned: FormValues = { ...values };

    for (const field of fields) {
        if (!visibleFields.has(field.id)) {
            // Reset to default value or undefined
            cleaned[field.id] = field.defaultValue ?? undefined;
        }
    }

    return cleaned;
}
