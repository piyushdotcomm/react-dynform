import React from 'react';
import type { FieldSchema } from '../../types/schema.js';

interface BaseFieldProps {
    field: FieldSchema;
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    error?: string;
    disabled?: boolean;
}

// ─────────────────────────────────────────────
// TextField
// ─────────────────────────────────────────────

export function TextField({ field, value, onChange, onBlur, error, disabled }: BaseFieldProps) {
    return (
        <input
            id={field.id}
            type={field.type === 'email' ? 'email' : field.type === 'password' ? 'password' : 'text'}
            value={typeof value === 'string' ? value : ''}
            placeholder={field.placeholder}
            disabled={disabled ?? field.disabled}
            readOnly={field.readOnly}
            aria-describedby={error ? `${field.id}-error` : undefined}
            aria-invalid={!!error}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
        />
    );
}

// ─────────────────────────────────────────────
// NumberField
// ─────────────────────────────────────────────

export function NumberField({ field, value, onChange, onBlur, error, disabled }: BaseFieldProps) {
    return (
        <input
            id={field.id}
            type="number"
            value={typeof value === 'number' || typeof value === 'string' ? String(value) : ''}
            placeholder={field.placeholder}
            disabled={disabled ?? field.disabled}
            min={field.min}
            max={field.max}
            step={field.step}
            aria-describedby={error ? `${field.id}-error` : undefined}
            aria-invalid={!!error}
            onChange={(e) => onChange(e.target.valueAsNumber)}
            onBlur={onBlur}
        />
    );
}

// ─────────────────────────────────────────────
// TextareaField
// ─────────────────────────────────────────────

export function TextareaField({ field, value, onChange, onBlur, error, disabled }: BaseFieldProps) {
    return (
        <textarea
            id={field.id}
            value={typeof value === 'string' ? value : ''}
            placeholder={field.placeholder}
            disabled={disabled ?? field.disabled}
            readOnly={field.readOnly}
            rows={field.rows ?? 4}
            aria-describedby={error ? `${field.id}-error` : undefined}
            aria-invalid={!!error}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
        />
    );
}

// ─────────────────────────────────────────────
// SelectField
// ─────────────────────────────────────────────

export function SelectField({ field, value, onChange, onBlur, error, disabled }: BaseFieldProps) {
    return (
        <select
            id={field.id}
            value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
            disabled={disabled ?? field.disabled}
            multiple={field.multiple}
            aria-describedby={error ? `${field.id}-error` : undefined}
            aria-invalid={!!error}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
        >
            <option value="">-- Select --</option>
            {field.options?.map((opt) => (
                <option key={String(opt.value)} value={String(opt.value)} disabled={opt.disabled}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}

// ─────────────────────────────────────────────
// CheckboxField
// ─────────────────────────────────────────────

export function CheckboxField({ field, value, onChange, onBlur, error, disabled }: BaseFieldProps) {
    return (
        <input
            id={field.id}
            type="checkbox"
            checked={typeof value === 'boolean' ? value : false}
            disabled={disabled ?? field.disabled}
            aria-describedby={error ? `${field.id}-error` : undefined}
            aria-invalid={!!error}
            onChange={(e) => onChange(e.target.checked)}
            onBlur={onBlur}
        />
    );
}

// ─────────────────────────────────────────────
// RadioField
// ─────────────────────────────────────────────

export function RadioField({ field, value, onChange, onBlur, error, disabled }: BaseFieldProps) {
    return (
        <div role="radiogroup" aria-labelledby={`${field.id}-label`}>
            {field.options?.map((opt) => (
                <label key={String(opt.value)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                        type="radio"
                        name={field.id}
                        value={String(opt.value)}
                        checked={value === opt.value}
                        disabled={disabled ?? field.disabled ?? opt.disabled}
                        onChange={() => onChange(opt.value)}
                        onBlur={onBlur}
                    />
                    {opt.label}
                </label>
            ))}
        </div>
    );
}
