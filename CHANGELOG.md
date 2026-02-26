# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-02-26

### Added
- Initial release of react-dynform
- Schema-driven form rendering from JSON schema
- Conditional field logic (show/hide based on other field values)
- Multi-step form wizard with step validation
- Built-in validation engine (required, minLength, maxLength, pattern, email, min, max)
- Headless hooks API: `useDynForm`, `useField`, `useFormStep`, `useValidation`
- Component API: `<DynForm />`, `<DynField />`, `<DynStep />`
- Plugin system for registering custom field types
- Full TypeScript support with strict types
- Zero runtime dependencies (React is a peer dependency)
