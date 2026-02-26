import type { FormSchema, FieldSchema, StepSchema } from '../types/schema.js';

// ─────────────────────────────────────────────
// Schema Parser
// Validates the shape of a FormSchema at runtime
// ─────────────────────────────────────────────

export class SchemaError extends Error {
    constructor(message: string) {
        super(`[react-dynform] SchemaError: ${message}`);
        this.name = 'SchemaError';
    }
}

/**
 * Parse and validate a FormSchema, returning a normalized form of it.
 * Throws SchemaError if the schema is invalid.
 */
export function parseSchema(schema: unknown): FormSchema {
    if (typeof schema !== 'object' || schema === null) {
        throw new SchemaError('Schema must be a non-null object.');
    }

    const s = schema as Record<string, unknown>;

    if (typeof s['id'] !== 'string' || s['id'].trim() === '') {
        throw new SchemaError('Schema must have a non-empty string "id" field.');
    }

    const hasFields = Array.isArray(s['fields']);
    const hasSteps = Array.isArray(s['steps']);

    if (!hasFields && !hasSteps) {
        throw new SchemaError('Schema must have either "fields" (flat form) or "steps" (multi-step form).');
    }

    if (hasFields && hasSteps) {
        throw new SchemaError('Schema cannot have both "fields" and "steps". Use one or the other.');
    }

    if (hasFields) {
        const fields = s['fields'] as unknown[];
        fields.forEach((f, i) => parseFieldSchema(f, `fields[${i}]`));
    }

    if (hasSteps) {
        const steps = s['steps'] as unknown[];
        if (steps.length === 0) {
            throw new SchemaError('"steps" array must not be empty.');
        }
        steps.forEach((step, i) => parseStepSchema(step, `steps[${i}]`));
    }

    return s as unknown as FormSchema;
}

function parseStepSchema(step: unknown, path: string): StepSchema {
    if (typeof step !== 'object' || step === null) {
        throw new SchemaError(`${path} must be a non-null object.`);
    }

    const s = step as Record<string, unknown>;

    if (typeof s['id'] !== 'string' || s['id'].trim() === '') {
        throw new SchemaError(`${path}.id must be a non-empty string.`);
    }

    if (typeof s['title'] !== 'string' || s['title'].trim() === '') {
        throw new SchemaError(`${path}.title must be a non-empty string.`);
    }

    if (!Array.isArray(s['fields'])) {
        throw new SchemaError(`${path}.fields must be an array.`);
    }

    (s['fields'] as unknown[]).forEach((f, i) =>
        parseFieldSchema(f, `${path}.fields[${i}]`)
    );

    return s as unknown as StepSchema;
}

function parseFieldSchema(field: unknown, path: string): FieldSchema {
    if (typeof field !== 'object' || field === null) {
        throw new SchemaError(`${path} must be a non-null object.`);
    }

    const f = field as Record<string, unknown>;

    if (typeof f['id'] !== 'string' || f['id'].trim() === '') {
        throw new SchemaError(`${path}.id must be a non-empty string.`);
    }

    if (typeof f['type'] !== 'string' || f['type'].trim() === '') {
        throw new SchemaError(`${path}.type must be a non-empty string.`);
    }

    if (typeof f['label'] !== 'string' || f['label'].trim() === '') {
        throw new SchemaError(`${path}.label must be a non-empty string.`);
    }

    // Validate options on select/radio/checkbox
    if (
        (f['type'] === 'select' || f['type'] === 'radio') &&
        !Array.isArray(f['options'])
    ) {
        throw new SchemaError(
            `${path}: field of type "${f['type']}" must have an "options" array.`
        );
    }

    return f as unknown as FieldSchema;
}

/**
 * Returns all fields from a schema (flat or multi-step), in order.
 */
export function getAllFields(schema: FormSchema): FieldSchema[] {
    if (schema.fields) {
        return schema.fields;
    }
    if (schema.steps) {
        return schema.steps.flatMap((step) => step.fields);
    }
    return [];
}

/**
 * Build a map of fieldId -> FieldSchema for quick lookups.
 */
export function buildFieldMap(schema: FormSchema): Map<string, FieldSchema> {
    const map = new Map<string, FieldSchema>();
    for (const field of getAllFields(schema)) {
        map.set(field.id, field);
    }
    return map;
}

/**
 * Get fields for a specific step by index.
 */
export function getStepFields(schema: FormSchema, stepIndex: number): FieldSchema[] {
    if (!schema.steps) return [];
    const step = schema.steps[stepIndex];
    return step ? step.fields : [];
}
