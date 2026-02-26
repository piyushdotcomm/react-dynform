import { useMemo } from 'react';
import type { FieldState, FormValues } from '../types/schema.js';
import type { FormErrors } from '../types/validation.js';

// ─────────────────────────────────────────────
// useField — Subscribe to a single field's state
// ─────────────────────────────────────────────

export interface UseFieldReturn {
    value: unknown;
    error: string | undefined;
    errors: string[];
    touched: boolean;
    dirty: boolean;
    visible: boolean;
    hasError: boolean;
}

/**
 * Extract the state of a single field from the form state.
 * Useful for building custom field renderers.
 */
export function useField(
    fieldId: string,
    formState: Record<string, FieldState>
): UseFieldReturn {
    return useMemo(() => {
        const state = formState[fieldId];

        if (!state) {
            return {
                value: undefined,
                error: undefined,
                errors: [],
                touched: false,
                dirty: false,
                visible: true,
                hasError: false,
            };
        }

        return {
            value: state.value,
            error: state.errors[0],
            errors: state.errors,
            touched: state.touched,
            dirty: state.dirty,
            visible: state.visible,
            hasError: state.errors.length > 0 && state.touched,
        };
    }, [fieldId, formState]);
}
