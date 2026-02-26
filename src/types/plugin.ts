import type { FieldSchema, FormValues } from './schema.js';

// ─────────────────────────────────────────────
// Plugin Interface
// ─────────────────────────────────────────────

export interface FieldPlugin<TProps = Record<string, unknown>> {
    /** The field type identifier string (e.g. "date-picker", "rich-text") */
    type: string;

    /** React component that renders the field */
    component: React.ComponentType<FieldPluginProps<TProps>>;

    /** Optional custom validation logic for this field type */
    validate?: (
        value: unknown,
        field: FieldSchema,
        allValues: FormValues
    ) => string | null; // return error message or null if valid

    /** Default value for this field type if none specified in schema */
    defaultValue?: unknown;
}

export interface FieldPluginProps<TProps = Record<string, unknown>> {
    field: FieldSchema;
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    error?: string;
    disabled?: boolean;
    props?: TProps;
}

// Import React for ComponentType
import type React from 'react';
