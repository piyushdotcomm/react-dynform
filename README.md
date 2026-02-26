# @piyushdotcom/react-dynform

A schema-driven dynamic form engine for React. Render fully functional forms from a JSON schema — with conditional logic, multi-step wizards, validation, and a plugin system.

[![npm version](https://img.shields.io/npm/v/@piyushdotcom/react-dynform)](https://www.npmjs.com/package/@piyushdotcom/react-dynform)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## About

`react-dynform` is a headless, schema-driven form builder for React. Instead of writing verbose JSX for complex forms, you define your form structure and logic in a single JSON schema object. It automatically handles state management, conditional rendering (e.g., showing fields only when other fields match specific criteria), and multi-step wizard logic out of the box.

## Features

- **Schema-Driven**: Define complex forms entirely via JSON.
- **Conditional Logic**: Built-in engine to show/hide fields based on the state of other fields.
- **Multi-Step Wizards**: Easy configuration for paginated forms.
- **Headless Design**: Bring your own UI components — the library manages the logic, you manage the look.
- **Validation**: Seamless validation integration.
- **TypeScript Ready**: Strongly typed for excellent developer experience.

## Installation

```bash
npm install @piyushdotcom/react-dynform
# or
yarn add @piyushdotcom/react-dynform
# or
pnpm add @piyushdotcom/react-dynform
```

### Requirements

- Node.js >= 20
- React >= 18.0.0
- React DOM >= 18.0.0

## Usage

Here is a minimal working example of how to render a form from a schema:

```tsx
import React from 'react';
import { useDynForm, SchemaParser } from '@piyushdotcom/react-dynform';

// 1. Define your form schema
const mySchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      title: "Username",
      required: true
    },
    subscribeTerms: {
      type: "boolean",
      title: "Subscribe to newsletter"
    },
    // Conditional field example
    email: {
      type: "string",
      title: "Email Address",
      visibleIf: {
        field: "subscribeTerms",
        equals: true
      }
    }
  }
};

export default function MyForm() {
  // 2. Initialize the form hook
  const formState = useDynForm({ schema: mySchema });

  const handleSubmit = (data) => {
    console.log("Form submitted with:", data);
  };

  // 3. Render using the SchemaParser component
  return (
    <form onSubmit={formState.handleSubmit(handleSubmit)}>
      <SchemaParser 
        schema={mySchema} 
        state={formState}
        // Map schema types to your own UI components
        components={{
          string: (props) => <input type="text" {...props} />,
          boolean: (props) => <input type="checkbox" {...props} />
        }}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Contributing

Contributions are welcome! Please ensure you run tests and typechecks before submitting pull requests.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/piyushdotcomm/react-dynform.git
cd react-dynform

# Install dependencies
npm install

# Start the dev watcher
npm run dev
```

### Running Tests

This project uses Vitest for testing.
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## License

`react-dynform` is licensed under the MIT license. See the [`LICENSE`](LICENSE) file for more information.
