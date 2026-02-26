import { describe, it, expect } from 'vitest';
import { validateField, validateForm, hasErrors } from '../../src/core/validator.js';
import type { FieldSchema } from '../../src/types/schema.js';

const nameField: FieldSchema = {
    id: 'name',
    type: 'text',
    label: 'Name',
    validation: [
        { rule: 'required', message: 'Name is required.' },
        { rule: 'minLength', value: 2, message: 'Name must be at least 2 characters.' },
    ],
};

const emailField: FieldSchema = {
    id: 'email',
    type: 'email',
    label: 'Email',
    validation: [
        { rule: 'required', message: 'Email is required.' },
        { rule: 'email', message: 'Invalid email address.' },
    ],
};

describe('validateField', () => {
    it('passes when value is valid', () => {
        const result = validateField(nameField, 'John', {});
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('fails required rule when empty', () => {
        const result = validateField(nameField, '', {});
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Name is required.');
    });

    it('fails minLength rule', () => {
        const result = validateField(nameField, 'J', {});
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Name must be at least 2 characters.');
    });

    it('validates email format', () => {
        expect(validateField(emailField, 'not-an-email', {}).valid).toBe(false);
        expect(validateField(emailField, 'test@example.com', {}).valid).toBe(true);
    });

    it('validates custom rule', () => {
        const field: FieldSchema = {
            id: 'age',
            type: 'number',
            label: 'Age',
            validation: [
                {
                    rule: 'custom',
                    message: 'Must be 18+',
                    validate: (v) => typeof v === 'number' && v >= 18,
                },
            ],
        };
        expect(validateField(field, 17, {}).valid).toBe(false);
        expect(validateField(field, 18, {}).valid).toBe(true);
    });
});

describe('validateForm', () => {
    it('returns errors only for visible fields', () => {
        const fields = [nameField, emailField];
        const values = { name: '', email: '' };
        const visible = new Set(['name']); // email is hidden

        const errors = validateForm(fields, values, visible);
        expect(errors['name']).toBeDefined();
        expect(errors['email']).toBeUndefined();
    });

    it('returns empty object when all valid', () => {
        const fields = [nameField];
        const values = { name: 'John' };
        const visible = new Set(['name']);
        const errors = validateForm(fields, values, visible);
        expect(Object.keys(errors)).toHaveLength(0);
    });
});

describe('hasErrors', () => {
    it('returns false for empty errors', () => {
        expect(hasErrors({})).toBe(false);
    });

    it('returns true when errors exist', () => {
        expect(hasErrors({ name: ['Name is required.'] })).toBe(true);
    });
});
