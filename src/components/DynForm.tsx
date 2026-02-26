import React from 'react';
import type { FormSchema } from '../types/schema.js';
import type { DynFormOptions } from '../hooks/use-dynform.js';
import { useDynForm } from '../hooks/use-dynform.js';
import { DynField } from './DynField.js';

// ─────────────────────────────────────────────
// DynForm — Root form component (complete solution)
// ─────────────────────────────────────────────

export interface DynFormProps extends DynFormOptions {
    schema: FormSchema;
    className?: string;
    style?: React.CSSProperties;

    // Render prop overrides for customization
    renderSubmitButton?: (props: {
        isSubmitting: boolean;
        isValid: boolean;
        handleSubmit: (e?: React.FormEvent) => Promise<void>;
    }) => React.ReactNode;

    renderResetButton?: (props: { resetForm: () => void }) => React.ReactNode;
    renderSuccess?: () => React.ReactNode;

    // Show loading state while submitting
    loadingText?: string;
    submitLabel?: string;
    resetLabel?: string;
}

export function DynForm({
    schema,
    className,
    style,
    renderSubmitButton,
    renderResetButton,
    renderSuccess,
    loadingText = 'Submitting...',
    submitLabel,
    resetLabel,
    ...options
}: DynFormProps) {
    const form = useDynForm(schema, options);

    if (form.isSubmitted && renderSuccess) {
        return <>{renderSuccess()}</>;
    }

    const isMultiStep = !!schema.steps;
    const currentFields = isMultiStep
        ? (schema.steps?.[form.step.currentStep]?.fields ?? [])
        : (form.allFields);

    return (
        <form
            onSubmit={form.handleSubmit}
            className={className}
            style={style}
            noValidate
        >
            {schema.title && <h2>{schema.title}</h2>}
            {schema.description && <p>{schema.description}</p>}

            {/* Multi-step progress indicator */}
            {isMultiStep && (
                <div role="progressbar" aria-valuenow={form.stepProgress} aria-valuemin={0} aria-valuemax={100}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        {schema.steps?.map((step, i) => (
                            <span
                                key={step.id}
                                style={{
                                    padding: '4px 12px',
                                    borderRadius: 4,
                                    background: i === form.step.currentStep ? '#3b82f6' : '#e5e7eb',
                                    color: i === form.step.currentStep ? '#fff' : '#374151',
                                    fontWeight: i === form.step.currentStep ? 600 : 400,
                                }}
                            >
                                {step.title}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Fields */}
            {currentFields.map((field) => (
                <DynField
                    key={field.id}
                    field={field}
                    formState={form.formState}
                    values={form.values}
                    onchange={form.setValue}
                    onBlur={form.touchField}
                />
            ))}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                {isMultiStep && !form.step.isFirstStep && (
                    <button type="button" onClick={form.prevStep}>
                        Back
                    </button>
                )}

                {isMultiStep && !form.step.isLastStep ? (
                    <button type="button" onClick={() => form.nextStep()}>
                        Next
                    </button>
                ) : renderSubmitButton ? (
                    renderSubmitButton({
                        isSubmitting: form.isSubmitting,
                        isValid: form.isValid,
                        handleSubmit: form.handleSubmit,
                    })
                ) : (
                    <button type="submit" disabled={form.isSubmitting}>
                        {form.isSubmitting ? loadingText : (submitLabel ?? schema.submitLabel ?? 'Submit')}
                    </button>
                )}

                {renderResetButton
                    ? renderResetButton({ resetForm: form.resetForm })
                    : resetLabel && (
                        <button type="button" onClick={form.resetForm}>
                            {resetLabel ?? schema.resetLabel ?? 'Reset'}
                        </button>
                    )}
            </div>
        </form>
    );
}
