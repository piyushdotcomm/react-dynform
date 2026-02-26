import { useMemo } from 'react';
import type { StepMachineState } from '../core/state-machine.js';
import type { FormSchema, StepSchema } from '../types/schema.js';

// ─────────────────────────────────────────────
// useFormStep — Multi-step navigation utilities
// ─────────────────────────────────────────────

export interface UseFormStepReturn {
    currentStep: number;
    totalSteps: number;
    isFirstStep: boolean;
    isLastStep: boolean;
    progress: number;
    currentStepSchema: StepSchema | undefined;
    stepTitles: string[];
    isStepVisited: (stepIndex: number) => boolean;
    isStepCompleted: (stepIndex: number) => boolean;
}

/**
 * Provides convenient multi-step navigation data derived from
 * the step machine state. Pairs with useDynForm().step.
 */
export function useFormStep(
    stepState: StepMachineState,
    schema: FormSchema,
    stepProgress: number
): UseFormStepReturn {
    return useMemo(() => {
        const currentStepSchema = schema.steps?.[stepState.currentStep];
        const stepTitles = schema.steps?.map((s) => s.title) ?? [];

        return {
            currentStep: stepState.currentStep,
            totalSteps: stepState.totalSteps,
            isFirstStep: stepState.isFirstStep,
            isLastStep: stepState.isLastStep,
            progress: stepProgress,
            currentStepSchema,
            stepTitles,
            isStepVisited: (i: number) => stepState.visitedSteps.has(i),
            isStepCompleted: (i: number) => stepState.completedSteps.has(i),
        };
    }, [stepState, schema, stepProgress]);
}
