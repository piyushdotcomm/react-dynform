import { describe, it, expect } from 'vitest';
import { evaluateCondition, computeVisibility } from '../../src/core/condition-engine.js';
import type { FieldSchema } from '../../src/types/schema.js';

describe('evaluateCondition', () => {
    it('equals operator — matches', () => {
        const result = evaluateCondition(
            { field: 'type', equals: 'company' },
            { type: 'company' }
        );
        expect(result).toBe(true);
    });

    it('equals operator — no match', () => {
        const result = evaluateCondition(
            { field: 'type', equals: 'company' },
            { type: 'individual' }
        );
        expect(result).toBe(false);
    });

    it('notEquals operator', () => {
        expect(evaluateCondition({ field: 'x', operator: 'notEquals', value: 'a' }, { x: 'b' })).toBe(true);
        expect(evaluateCondition({ field: 'x', operator: 'notEquals', value: 'a' }, { x: 'a' })).toBe(false);
    });

    it('contains operator for string', () => {
        expect(evaluateCondition({ field: 'x', operator: 'contains', value: 'foo' }, { x: 'foobar' })).toBe(true);
        expect(evaluateCondition({ field: 'x', operator: 'contains', value: 'baz' }, { x: 'foobar' })).toBe(false);
    });

    it('greaterThan operator', () => {
        expect(evaluateCondition({ field: 'age', operator: 'greaterThan', value: 18 }, { age: 21 })).toBe(true);
        expect(evaluateCondition({ field: 'age', operator: 'greaterThan', value: 18 }, { age: 16 })).toBe(false);
    });

    it('exists operator', () => {
        expect(evaluateCondition({ field: 'x', operator: 'exists' }, { x: 'value' })).toBe(true);
        expect(evaluateCondition({ field: 'x', operator: 'exists' }, { x: '' })).toBe(false);
        expect(evaluateCondition({ field: 'x', operator: 'exists' }, {})).toBe(false);
    });
});

describe('computeVisibility', () => {
    const fields: FieldSchema[] = [
        { id: 'type', type: 'select', label: 'Type', options: [] },
        {
            id: 'companyName',
            type: 'text',
            label: 'Company Name',
            condition: { field: 'type', equals: 'company' },
        },
        { id: 'name', type: 'text', label: 'Name', hidden: true },
    ];

    it('hides conditional field when condition not met', () => {
        const visible = computeVisibility(fields, { type: 'individual' });
        expect(visible.has('companyName')).toBe(false);
        expect(visible.has('type')).toBe(true);
    });

    it('shows conditional field when condition is met', () => {
        const visible = computeVisibility(fields, { type: 'company' });
        expect(visible.has('companyName')).toBe(true);
    });

    it('always hides fields marked as hidden', () => {
        const visible = computeVisibility(fields, {});
        expect(visible.has('name')).toBe(false);
    });
});
