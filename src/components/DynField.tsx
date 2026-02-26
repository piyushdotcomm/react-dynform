import React from 'react';
import type { FieldSchema, FormState, FormValues } from '../types/schema.js';
import { getPluginRegistry } from '../plugins/plugin-registry.js';
import {
    TextField,
    NumberField,
    TextareaField,
    SelectField,
    CheckboxField,
    RadioField,
} from './fields/index.js';

// ─────────────────────────────────────────────
// DynField — Renders a single field by dispatching to the correct component
// ─────────────────────────────────────────────

export interface DynFieldProps {
    field: FieldSchema;
    formState: FormState;
    values: FormValues;
    onchange: (fieldId: string, value: unknown) => void;
    onBlur: (fieldId: string) => void;
    showErrors?: boolean;
    disabled?: boolean;
    className?: string;
    renderLabel?: (field: FieldSchema) => React.ReactNode;
    renderError?: (error: string, field: FieldSchema) => React.ReactNode;
}

export function DynField({
    field,
    formState,
    values: _values,
    onchange,
    onBlur,
    showErrors = true,
    disabled,
    className,
    renderLabel,
    renderError,
}: DynFieldProps) {
    const state = formState[field.id];

    if (!state?.visible) return null;

    const value = state.value;
    const error = state.touched && state.errors.length > 0 ? state.errors[0] : undefined;
    const handleChange = (val: unknown) => onchange(field.id, val);
    const handleBlur = () => onBlur(field.id);

    const fieldProps = {
        field,
        value,
        onChange: handleChange,
        onBlur: handleBlur,
        error,
        disabled,
    };

    // Try plugin registry first
    const plugin = getPluginRegistry().get(field.type);
    const FieldComponent = plugin
        ? plugin.component
        : getBuiltinComponent(field.type);

    const label = renderLabel
        ? renderLabel(field)
        : (
            <label htmlFor={field.type === 'radio' ? undefined : field.id} id={`${field.id}-label`}>
                {field.label}
                {field.required && <span aria-hidden="true" style={{ color: 'red', marginLeft: 4 }}>*</span>}
            </label>
        );

    const errorEl = error && showErrors
        ? (renderError
            ? renderError(error, field)
            : <span id={`${field.id}-error`} role="alert" style={{ color: 'red', fontSize: '0.875em' }}>{error}</span>)
        : null;

    return (
        <div className={className} style={{ marginBottom: 16 }}>
            {field.type !== 'checkbox' && label}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {field.type === 'checkbox' && label}
                {FieldComponent ? (
                    <FieldComponent {...fieldProps} />
                ) : (
                    <span style={{ color: 'orange' }}>Unknown field type: {field.type}</span>
                )}
            </div>
            {field.description && !error && (
                <small style={{ color: '#666' }}>{field.description}</small>
            )}
            {errorEl}
        </div>
    );
}

function getBuiltinComponent(type: string) {
    switch (type) {
        case 'text':
        case 'email':
        case 'password':
        case 'date':
            return TextField;
        case 'number':
            return NumberField;
        case 'textarea':
            return TextareaField;
        case 'select':
            return SelectField;
        case 'checkbox':
            return CheckboxField;
        case 'radio':
            return RadioField;
        default:
            return null;
    }
}
