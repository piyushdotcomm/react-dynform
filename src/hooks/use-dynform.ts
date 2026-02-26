import { useReducer, useCallback, useMemo } from 'react';
import type { FormSchema, FormValues, FormState, FieldState } from '../types/schema.js';
import type { FormErrors } from '../types/validation.js';
import { parseSchema, getAllFields, buildFieldMap } from '../core/schema-parser.js';
import { validateForm, hasErrors } from '../core/validator.js';
import { computeVisibility, clearHiddenFieldValues } from '../core/condition-engine.js';
import {
    createStepMachineState,
    tryNextStep,
    prevStep,
    goToStep,
    markStepComplete,
    getStepProgress,
    type StepMachineState,
} from '../core/state-machine.js';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface DynFormOptions {
    onSubmit?: (values: FormValues) => void | Promise<void>;
    onError?: (errors: FormErrors) => void;
    onChange?: (values: FormValues) => void;
    initialValues?: FormValues;
}

export interface DynFormReturn {
    // Values & State
    values: FormValues;
    errors: FormErrors;
    formState: FormState;
    isSubmitting: boolean;
    isSubmitted: boolean;
    isDirty: boolean;
    isValid: boolean;
    visibleFields: Set<string>;

    // Field operations
    setValue: (fieldId: string, value: unknown) => void;
    setValues: (values: Partial<FormValues>) => void;
    touchField: (fieldId: string) => void;
    touchAll: () => void;
    resetForm: () => void;

    // Submit
    handleSubmit: (e?: React.FormEvent) => Promise<void>;

    // Multi-step
    step: StepMachineState;
    nextStep: () => Promise<boolean>;
    prevStep: () => void;
    goToStep: (index: number) => void;
    stepProgress: number;

    // Schema
    schema: FormSchema;
    allFields: ReturnType<typeof getAllFields>;
}

// ─────────────────────────────────────────────
// State Shape
// ─────────────────────────────────────────────

interface InternalState {
    values: FormValues;
    errors: FormErrors;
    touched: Record<string, boolean>;
    isSubmitting: boolean;
    isSubmitted: boolean;
    stepState: StepMachineState;
}

type Action =
    | { type: 'SET_VALUE'; fieldId: string; value: unknown }
    | { type: 'SET_VALUES'; values: Partial<FormValues> }
    | { type: 'TOUCH_FIELD'; fieldId: string }
    | { type: 'TOUCH_ALL'; fieldIds: string[] }
    | { type: 'SET_ERRORS'; errors: FormErrors }
    | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
    | { type: 'SET_SUBMITTED' }
    | { type: 'SET_STEP'; stepState: StepMachineState }
    | { type: 'RESET'; initial: InternalState };

function createInitialState(
    schema: FormSchema,
    initialValues: FormValues
): InternalState {
    const allFields = getAllFields(schema);
    const values: FormValues = {};

    for (const field of allFields) {
        values[field.id] = field.id in initialValues
            ? initialValues[field.id]
            : (field.defaultValue ?? getDefaultForType(field.type));
    }

    return {
        values,
        errors: {},
        touched: {},
        isSubmitting: false,
        isSubmitted: false,
        stepState: createStepMachineState(schema),
    };
}

function getDefaultForType(type: string): unknown {
    switch (type) {
        case 'checkbox': return false;
        case 'number': return '';
        case 'select':
        case 'radio': return '';
        default: return '';
    }
}

function reducer(state: InternalState, action: Action): InternalState {
    switch (action.type) {
        case 'SET_VALUE':
            return {
                ...state,
                values: { ...state.values, [action.fieldId]: action.value },
            };

        case 'SET_VALUES':
            return { ...state, values: { ...state.values, ...action.values } };

        case 'TOUCH_FIELD':
            return {
                ...state,
                touched: { ...state.touched, [action.fieldId]: true },
            };

        case 'TOUCH_ALL': {
            const touched: Record<string, boolean> = { ...state.touched };
            for (const id of action.fieldIds) {
                touched[id] = true;
            }
            return { ...state, touched };
        }

        case 'SET_ERRORS':
            return { ...state, errors: action.errors };

        case 'SET_SUBMITTING':
            return { ...state, isSubmitting: action.isSubmitting };

        case 'SET_SUBMITTED':
            return { ...state, isSubmitted: true, isSubmitting: false };

        case 'SET_STEP':
            return { ...state, stepState: action.stepState };

        case 'RESET':
            return action.initial;
    }
}

// ─────────────────────────────────────────────
// Main Hook
// ─────────────────────────────────────────────

export function useDynForm(
    rawSchema: FormSchema,
    options: DynFormOptions = {}
): DynFormReturn {
    const { onSubmit, onError, onChange, initialValues = {} } = options;

    // Parse and validate schema once
    const schema = useMemo(() => parseSchema(rawSchema), [rawSchema]);
    const allFields = useMemo(() => getAllFields(schema), [schema]);

    const initial = useMemo(
        () => createInitialState(schema, initialValues),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [schema]
    );

    const [state, dispatch] = useReducer(reducer, initial);

    // Compute visibility on every render (reactive to value changes)
    const visibleFields = useMemo(
        () => computeVisibility(allFields, state.values),
        [allFields, state.values]
    );

    // Compute form state (per-field) for consumers
    const formState = useMemo<FormState>(() => {
        const result: FormState = {};
        for (const field of allFields) {
            const fieldState: FieldState = {
                value: state.values[field.id],
                touched: !!state.touched[field.id],
                dirty: state.values[field.id] !== initial.values[field.id],
                errors: state.errors[field.id] ?? [],
                visible: visibleFields.has(field.id),
            };
            result[field.id] = fieldState;
        }
        return result;
    }, [allFields, state, visibleFields, initial.values]);

    const isDirty = useMemo(
        () => allFields.some((f) => state.values[f.id] !== initial.values[f.id]),
        [allFields, state.values, initial.values]
    );

    const isValid = useMemo(
        () => !hasErrors(state.errors),
        [state.errors]
    );

    // ── Field operations ──

    const setValue = useCallback(
        (fieldId: string, value: unknown) => {
            dispatch({ type: 'SET_VALUE', fieldId, value });
            onChange?.({ ...state.values, [fieldId]: value });
        },
        [onChange, state.values]
    );

    const setValues = useCallback(
        (values: Partial<FormValues>) => {
            dispatch({ type: 'SET_VALUES', values });
        },
        []
    );

    const touchField = useCallback((fieldId: string) => {
        dispatch({ type: 'TOUCH_FIELD', fieldId });
        // Run field-level validation on blur
        const fieldMap = buildFieldMap(schema);
        const field = fieldMap.get(fieldId);
        if (field) {
            const errors = validateForm([field], state.values, visibleFields);
            dispatch({ type: 'SET_ERRORS', errors: { ...state.errors, ...errors } });
        }
    }, [schema, state, visibleFields]);

    const touchAll = useCallback(() => {
        dispatch({ type: 'TOUCH_ALL', fieldIds: allFields.map((f) => f.id) });
    }, [allFields]);

    const resetForm = useCallback(() => {
        dispatch({ type: 'RESET', initial });
    }, [initial]);

    // ── Submit ──

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault();
            touchAll();

            const cleanedValues = clearHiddenFieldValues(allFields, state.values, visibleFields);
            const errors = validateForm(allFields, cleanedValues, visibleFields);

            dispatch({ type: 'SET_ERRORS', errors });

            if (hasErrors(errors)) {
                onError?.(errors);
                return;
            }

            dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
            try {
                await onSubmit?.(cleanedValues);
                dispatch({ type: 'SET_SUBMITTED' });
            } finally {
                dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
            }
        },
        [allFields, state.values, visibleFields, touchAll, onError, onSubmit]
    );

    // ── Multi-step ──

    const handleNextStep = useCallback(async (): Promise<boolean> => {
        const { newState, result } = tryNextStep(state.stepState, schema, state.values);
        if (!result.success) {
            if (result.errors) dispatch({ type: 'SET_ERRORS', errors: result.errors });
            touchAll();
            return false;
        }
        dispatch({ type: 'SET_STEP', stepState: markStepComplete(newState, state.stepState.currentStep) });
        return true;
    }, [state.stepState, schema, state.values, touchAll]);

    const handlePrevStep = useCallback(() => {
        dispatch({ type: 'SET_STEP', stepState: prevStep(state.stepState) });
    }, [state.stepState]);

    const handleGoToStep = useCallback((index: number) => {
        dispatch({ type: 'SET_STEP', stepState: goToStep(state.stepState, index) });
    }, [state.stepState]);

    return {
        values: state.values,
        errors: state.errors,
        formState,
        isSubmitting: state.isSubmitting,
        isSubmitted: state.isSubmitted,
        isDirty,
        isValid,
        visibleFields,
        setValue,
        setValues,
        touchField,
        touchAll,
        resetForm,
        handleSubmit,
        step: state.stepState,
        nextStep: handleNextStep,
        prevStep: handlePrevStep,
        goToStep: handleGoToStep,
        stepProgress: getStepProgress(state.stepState),
        schema,
        allFields,
    };
}
