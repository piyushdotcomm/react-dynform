import { describe, it, expect } from 'vitest';
import { parseSchema, getAllFields, buildFieldMap, SchemaError } from '../../src/core/schema-parser.js';
import type { FormSchema } from '../../src/types/schema.js';

const flatSchema: FormSchema = {
    id: 'test-form',
    fields: [
        { id: 'name', type: 'text', label: 'Name' },
        { id: 'email', type: 'email', label: 'Email' },
    ],
};

const multiStepSchema: FormSchema = {
    id: 'multi-form',
    steps: [
        {
            id: 'step1',
            title: 'Step 1',
            fields: [{ id: 'name', type: 'text', label: 'Name' }],
        },
        {
            id: 'step2',
            title: 'Step 2',
            fields: [{ id: 'email', type: 'email', label: 'Email' }],
        },
    ],
};

describe('parseSchema', () => {
    it('parses a valid flat schema', () => {
        expect(() => parseSchema(flatSchema)).not.toThrow();
    });

    it('parses a valid multi-step schema', () => {
        expect(() => parseSchema(multiStepSchema)).not.toThrow();
    });

    it('throws if schema is not an object', () => {
        expect(() => parseSchema(null)).toThrow(SchemaError);
        expect(() => parseSchema('string')).toThrow(SchemaError);
    });

    it('throws if schema has no id', () => {
        expect(() => parseSchema({ fields: [] })).toThrow(SchemaError);
    });

    it('throws if schema has both fields and steps', () => {
        expect(() =>
            parseSchema({ id: 'x', fields: [], steps: [] })
        ).toThrow(SchemaError);
    });

    it('throws if schema has neither fields nor steps', () => {
        expect(() => parseSchema({ id: 'x' })).toThrow(SchemaError);
    });

    it('throws if a select field has no options', () => {
        expect(() =>
            parseSchema({ id: 'x', fields: [{ id: 'f', type: 'select', label: 'L' }] })
        ).toThrow(SchemaError);
    });
});

describe('getAllFields', () => {
    it('returns fields from flat schema', () => {
        const fields = getAllFields(flatSchema);
        expect(fields).toHaveLength(2);
        expect(fields[0]?.id).toBe('name');
    });

    it('returns all fields from multi-step schema', () => {
        const fields = getAllFields(multiStepSchema);
        expect(fields).toHaveLength(2);
    });
});

describe('buildFieldMap', () => {
    it('creates a map of fieldId -> FieldSchema', () => {
        const map = buildFieldMap(flatSchema);
        expect(map.get('name')?.label).toBe('Name');
        expect(map.get('email')?.type).toBe('email');
    });
});
