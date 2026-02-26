import { useCallback } from 'react';
import type { FieldSchema, FormValues } from '../types/schema.js';
import type { FormErrors } from '../types/validation.js';
import { validateForm, hasErrors } from '../core/validator.js';
import { computeVisibility } from '../core/condition-engine.js';

// ─────────────────────────────────────────────
// useValidation — Manual validation trigger
// ─────────────────────────────────────────────

export interface UseValidationReturn {
    validateFields: (fields: FieldSchema[], values: FormValues) => FormErrors;
    validateSingleField: (field: FieldSchema, value: unknown, allValues: FormValues) => string[];
    checkIsValid: (fields: FieldSchema[], values: FormValues) => boolean;
}

/**
 * Provides manual validation utilities, useful for building
 * custom submit buttons or partial form validation.
 */
export function useValidation(): UseValidationReturn {
    const validateFields = useCallback(
        (fields: FieldSchema[], values: FormValues): FormErrors => {
            const visible = computeVisibility(fields, values);
            return validateForm(fields, values, visible);
        },
        []
    );

    const validateSingleField = useCallback(
        (field: FieldSchema, value: unknown, allValues: FormValues): string[] => {
            const visible = computeVisibility([field], allValues);
            const errors = validateForm([field], { ...allValues, [field.id]: value }, visible);
            return errors[field.id] ?? [];
        },
        []
    );

    const checkIsValid = useCallback(
        (fields: FieldSchema[], values: FormValues): boolean => {
            const errors = validateFields(fields, values);
            return !hasErrors(errors);
        },
        [validateFields]
    );

    return { validateFields, validateSingleField, checkIsValid };
}
