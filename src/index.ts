// ─────────────────────────────────────────────
// react-dynform — Public API
// ─────────────────────────────────────────────

// ── Components ──
export { DynForm } from './components/DynForm.js';
export { DynField } from './components/DynField.js';
export { DynStep } from './components/DynStep.js';

// ── Hooks ──
export { useDynForm } from './hooks/use-dynform.js';
export { useField } from './hooks/use-field.js';
export { useFormStep } from './hooks/use-form-step.js';
export { useValidation } from './hooks/use-validation.js';

// ── Plugin System ──
export { registerField, getPluginRegistry } from './plugins/plugin-registry.js';

// ── Types (all public-facing types) ──
export type {
    FormSchema,
    StepSchema,
    FieldSchema,
    FieldOption,
    FieldCondition,
    ConditionOperator,
    FieldType,
    FieldState,
    FormValues,
    FormState,
} from './types/schema.js';

export type {
    ValidationRule,
    ValidationResult,
    FormErrors,
    RequiredRule,
    MinLengthRule,
    MaxLengthRule,
    MinRule,
    MaxRule,
    PatternRule,
    EmailRule,
    CustomRule,
} from './types/validation.js';

export type {
    FieldPlugin,
    FieldPluginProps,
} from './types/plugin.js';

export type { DynFormOptions, DynFormReturn } from './hooks/use-dynform.js';
export type { UseFieldReturn } from './hooks/use-field.js';
export type { UseFormStepReturn } from './hooks/use-form-step.js';
export type { UseValidationReturn } from './hooks/use-validation.js';

// ── Core utilities (for advanced users) ──
export { parseSchema, getAllFields, buildFieldMap, SchemaError } from './core/schema-parser.js';
export { validateField, validateForm, hasErrors } from './core/validator.js';
export { evaluateCondition, computeVisibility } from './core/condition-engine.js';
