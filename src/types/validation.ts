// ─────────────────────────────────────────────
// Validation Types
// ─────────────────────────────────────────────

export type ValidationRuleType =
    | 'required'
    | 'minLength'
    | 'maxLength'
    | 'min'
    | 'max'
    | 'pattern'
    | 'email'
    | 'custom';

export interface BaseValidationRule {
    message: string;
}

export interface RequiredRule extends BaseValidationRule {
    rule: 'required';
}

export interface MinLengthRule extends BaseValidationRule {
    rule: 'minLength';
    value: number;
}

export interface MaxLengthRule extends BaseValidationRule {
    rule: 'maxLength';
    value: number;
}

export interface MinRule extends BaseValidationRule {
    rule: 'min';
    value: number;
}

export interface MaxRule extends BaseValidationRule {
    rule: 'max';
    value: number;
}

export interface PatternRule extends BaseValidationRule {
    rule: 'pattern';
    value: string; // regex string
}

export interface EmailRule extends BaseValidationRule {
    rule: 'email';
}

export interface CustomRule extends BaseValidationRule {
    rule: 'custom';
    validate: (value: unknown, allValues: Record<string, unknown>) => boolean;
}

export type ValidationRule =
    | RequiredRule
    | MinLengthRule
    | MaxLengthRule
    | MinRule
    | MaxRule
    | PatternRule
    | EmailRule
    | CustomRule;

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export type FormErrors = Record<string, string[]>;
