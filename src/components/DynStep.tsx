import React from 'react';
import type { FormSchema } from '../types/schema.js';
import type { DynFormOptions } from '../hooks/use-dynform.js';
import { useDynForm } from '../hooks/use-dynform.js';
import { DynField } from './DynField.js';

// ─────────────────────────────────────────────
// DynStep — Renders only the current step's fields
// Use this for building custom multi-step UIs
// ─────────────────────────────────────────────

export interface DynStepProps {
    schema: FormSchema;
    stepIndex: number;
    form: ReturnType<typeof useDynForm>;
    className?: string;
    showStepTitle?: boolean;
}

export function DynStep({ schema, stepIndex, form, className, showStepTitle = true }: DynStepProps) {
    const step = schema.steps?.[stepIndex];
    if (!step) return null;

    return (
        <div className={className}>
            {showStepTitle && (
                <div style={{ marginBottom: 12 }}>
                    <h3 style={{ margin: 0 }}>{step.title}</h3>
                    {step.description && <p style={{ color: '#666', marginTop: 4 }}>{step.description}</p>}
                </div>
            )}

            {step.fields.map((field) => (
                <DynField
                    key={field.id}
                    field={field}
                    formState={form.formState}
                    values={form.values}
                    onchange={form.setValue}
                    onBlur={form.touchField}
                />
            ))}
        </div>
    );
}
