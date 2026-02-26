import type { FormSchema, FormValues, FieldSchema } from '../types/schema.js';
import type { FormErrors } from '../types/validation.js';
import { getStepFields } from './schema-parser.js';
import { validateStep } from './validator.js';
import { computeVisibility } from './condition-engine.js';

// ─────────────────────────────────────────────
// Multi-Step State Machine
// ─────────────────────────────────────────────

export interface StepMachineState {
    currentStep: number;
    totalSteps: number;
    isFirstStep: boolean;
    isLastStep: boolean;
    completedSteps: Set<number>;
    visitedSteps: Set<number>;
}

export interface StepTransitionResult {
    success: boolean;
    errors?: FormErrors;
}

/**
 * Create initial step machine state for a multi-step schema.
 */
export function createStepMachineState(schema: FormSchema): StepMachineState {
    const totalSteps = schema.steps?.length ?? 1;
    return {
        currentStep: 0,
        totalSteps,
        isFirstStep: true,
        isLastStep: totalSteps === 1,
        completedSteps: new Set(),
        visitedSteps: new Set([0]),
    };
}

/**
 * Attempt to move to the next step.
 * Validates current step fields before advancing.
 * Returns success=false with errors if validation fails.
 */
export function tryNextStep(
    state: StepMachineState,
    schema: FormSchema,
    values: FormValues
): { newState: StepMachineState; result: StepTransitionResult } {
    if (state.isLastStep) {
        return { newState: state, result: { success: false } };
    }

    // Validate current step fields
    const stepFields = getStepFields(schema, state.currentStep);
    const visibleFields = computeVisibility(stepFields, values);
    const errors = validateStep(stepFields, values, visibleFields);

    const hasErrors = Object.values(errors).some((e) => e.length > 0);
    if (hasErrors) {
        return { newState: state, result: { success: false, errors } };
    }

    const nextStep = state.currentStep + 1;
    const newState = updateStepState(state, nextStep);
    return { newState, result: { success: true } };
}

/**
 * Move to the previous step (no validation needed).
 */
export function prevStep(state: StepMachineState): StepMachineState {
    if (state.isFirstStep) return state;
    return updateStepState(state, state.currentStep - 1);
}

/**
 * Jump to a specific step (only if already visited).
 */
export function goToStep(
    state: StepMachineState,
    targetStep: number
): StepMachineState {
    if (
        targetStep < 0 ||
        targetStep >= state.totalSteps ||
        !state.visitedSteps.has(targetStep)
    ) {
        return state;
    }
    return updateStepState(state, targetStep);
}

/**
 * Mark a step as completed.
 */
export function markStepComplete(
    state: StepMachineState,
    step: number
): StepMachineState {
    const completedSteps = new Set(state.completedSteps);
    completedSteps.add(step);
    return { ...state, completedSteps };
}

function updateStepState(
    state: StepMachineState,
    newStep: number
): StepMachineState {
    const visitedSteps = new Set(state.visitedSteps);
    visitedSteps.add(newStep);

    return {
        ...state,
        currentStep: newStep,
        isFirstStep: newStep === 0,
        isLastStep: newStep === state.totalSteps - 1,
        visitedSteps,
    };
}

/**
 * Get the step progress as a percentage (0–100).
 */
export function getStepProgress(state: StepMachineState): number {
    if (state.totalSteps <= 1) return 100;
    return Math.round((state.currentStep / (state.totalSteps - 1)) * 100);
}
