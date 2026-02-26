import type { ValidationRule } from './validation.js';

// ─────────────────────────────────────────────
// Field Types
// ─────────────────────────────────────────────

export type FieldType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'date'
    | string; // allows plugin-registered custom types

// ─────────────────────────────────────────────
// Condition (for show/hide logic)
// ─────────────────────────────────────────────

export type ConditionOperator = 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'exists';

export interface FieldCondition {
    field: string;
    operator?: ConditionOperator; // defaults to 'equals'
    equals?: unknown;             // shorthand for operator: 'equals'
    value?: unknown;              // generic value for other operators
}

// ─────────────────────────────────────────────
// Select / Radio Options
// ─────────────────────────────────────────────

export interface FieldOption {
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
}

// ─────────────────────────────────────────────
// Field Schema
// ─────────────────────────────────────────────

export interface FieldSchema {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    defaultValue?: unknown;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    hidden?: boolean;
    validation?: ValidationRule[];
    condition?: FieldCondition;      // show field only when this is true
    options?: FieldOption[];         // for select/radio/checkbox-group
    multiple?: boolean;              // for select with multiple
    rows?: number;                   // for textarea
    min?: number;                    // for number/date inputs
    max?: number;                    // for number/date inputs
    step?: number;                   // for number inputs
    description?: string;            // helper text below field
    className?: string;              // custom CSS classes
    [key: string]: unknown;          // allow extra props for plugins
}

// ─────────────────────────────────────────────
// Step Schema (for multi-step forms)
// ─────────────────────────────────────────────

export interface StepSchema {
    id: string;
    title: string;
    description?: string;
    fields: FieldSchema[];
    condition?: FieldCondition;      // skip entire step if condition false
}

// ─────────────────────────────────────────────
// Root Form Schema
// ─────────────────────────────────────────────

export interface FormSchema {
    id: string;
    title?: string;
    description?: string;
    fields?: FieldSchema[];     // simple flat form (no steps)
    steps?: StepSchema[];       // multi-step form
    submitLabel?: string;
    resetLabel?: string;
}

// ─────────────────────────────────────────────
// Runtime Field State (used internally by hooks)
// ─────────────────────────────────────────────

export interface FieldState {
    value: unknown;
    touched: boolean;
    dirty: boolean;
    errors: string[];
    visible: boolean;
}

export type FormValues = Record<string, unknown>;
export type FormState = Record<string, FieldState>;
