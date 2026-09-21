# MoneyHelper Forms Shared Library (`libs/shared/mhf`)

---

## Table of Contents

- [Purpose](#purpose)
- [What’s Included](#whats-included)
  - [Store Management](#store-management)
  - [Store Update Patterns](#store-update-patterns)
  - [Dynamic Steps Array & Flow Construction](#dynamic-steps-array--flow-construction)
  - [Common Guards](#common-guards)
  - [Validation Utilities](#validation-utilities)
  - [Shared Components](#shared-components)
  - [Type System](#type-system)
  - [Utilities](#utilities)
- [Directory Structure](#directory-structure)
- [Usage](#usage)
- [Extending in Apps](#extending-in-apps)
  - [Type Extension Pattern](#type-extension-pattern)
  - [Custom Guards](#custom-guards)
  - [Store Data Extension](#store-data-extension)
- [Testing](#testing)
- [Accessibility & Language](#accessibility--language)
- [Contribution](#contribution)

This library provides the **base components, store logic, guards, validation, and utilities** for all MoneyHelper forms apps in the MaPS Digital monorepo.  
It is designed for maximum reusability, strict TypeScript mode, and bilingual support (English/Welsh).

## Purpose

- Centralizes all **form journey logic** for MoneyHelper apps (e.g. Booking Forms, Contact Forms)
- Ensures **consistency** and **DRY code** across 24+ Next.js applications
- Supports **JavaScript-free functionality** and **accessibility** requirements
- Enables **easy extension** for app-specific needs

---

## What’s Included

### Store Management

Session creation, retrieval, and mutation using shared Redis helpers:

- `ensureSessionAndStore()` - Initialize or retrieve session with UUID and store entry
- `getStoreEntry()` - Retrieve form data from Redis by session key
- `setStoreEntry()` - Update form data in Redis
- Store types and interfaces for strict TypeScript mode

MHF sessions use the explicit `SESSION_TTL_SECONDS` value from the shared
constants. `setStoreEntry()` applies this value to the Redis entry and
`ensureSessionAndStore()` applies the same value as the session cookie's
`Max-Age`, keeping the browser cookie and Redis entry lifetime aligned.

**Session Cookie Configuration:**

Each consuming app must set a `COOKIE_NAME` environment variable to a value unique to that app. This is required so apps sharing this library on the same domain don't read/overwrite each other's session cookie. `ensureSessionAndStore()`, `getSessionId()`, and `cleanupSession()` all throw if `COOKIE_NAME` is not set.

**Store Update Patterns:**

Store updates occur during form submission and navigation, using the shared helpers provided by this library. Apps handle their own form data and journey logic, calling `setStoreEntry()` to persist changes as needed.

For implementation details, see the app-specific README files:

- [Contact Forms README](../../apps/moneyhelper-contact-forms/README.md)
- [Booking Forms README](../../apps/moneyhelper-booking-forms/README.md)

### Dynamic Steps Array & Flow Construction

Apps that use this shared library (e.g. MoneyHelper Contact Forms, MoneyHelper Booking Forms) construct an array of steps (`entry.steps[]`) dynamically during the user journey, based on the submitted `nextStep` value from each form submission. This sets the next step for the user while also creating a breadcrumb trail that is used when the user goes back a step (via the back button or browser back button).

**How it works:**

- Each time a user submits a form, the handler extracts the `nextStep` value.
- The `resolveNextSteps()` utility updates the steps array, splicing in the new step and discarding any future steps, following a "git rebase" pattern.
- This enables flexible branching, junctions, and backward navigation, allowing users to change their path at any decision point.
- The store always reflects the user's current journey, supporting both forward progression and dynamic rerouting.

**Key Functions:**

- `resolveNextSteps(entry, stepName)` — Rebases the steps array based on the submitted step.
- `getBackStep(context)` — Calculates the previous step for back navigation from the current request context.
- `getCurrentStep(context)` — Determines the current step from the request URL.

**Benefits:**

- Supports complex, multi-path journeys without hardcoding step arrays.
- Enables deep-linking, auto-advance, and dynamic flow changes.
- Keeps user progress and history intact, even when switching flows.

See app-specific READMEs for implementation examples.

### Common Guards

Reusable guard functions that run before rendering steps:

- `cookieGuard` - Ensures session cookie exists, redirects if missing
- `validateStepGuard` - Validates current step is accessible in flow
- `runGuardsBase()` - Helper to execute guard arrays in sequence

### Validation Utilities

Shared Zod schemas and validation helpers:

- `parseFormData()` - Parse submitted fields, including junction values and next-step routing
- `syncCurrentStep()` - Synchronize the stored step index with the submitted current step
- Phone number validation (UK format)
- Postcode validation (UK format)
- Date of birth validation with age checks
- `validateFormSubmission()` - Generic form submission validator

### Shared Components

Reusable React components for consistent UX:

- `FormWrapper` - Main form container with navigation, error handling
- `FormErrorCallout` - Accessible error message display
- `OptionTypes` - Radio button and checkbox components
- `SectionsRenderer` - Dynamic form section rendering
- `SubTitleRenderer` - Consistent subtitle formatting

All components support Welsh/English via `useTranslation` hook.

### Type System

Base types and interfaces that apps extend for their specific needs:

- `Entry` - Store entry structure
- `EntryData` - Form field data types
- Guard and validation types

### Utilities

Helper functions for form flow management:

- `getCurrentStep()` - Determine current step from URL/store
- `getBackStep()` - Calculate previous step in journey
- `getFieldError()` - Extract field-specific error messages
- `getSessionId()` - Retrieve session ID from cookies
- `getCookieName()` - Read the app's `COOKIE_NAME` env var, throws if unset
- `findEncodedOptionValue()` - Restore encoded option values for submitted junction fields
- `safeT()` - Safe translation helper with fallbacks

---

## Directory Structure

```
libs/shared/mhf/
├── src/
│   ├── components/         # Shared React components for forms
│   ├── constants/          # Shared MHF constants, including session TTL
│   ├── form/               # Form parsing and validation helpers
│   ├── guards/             # Common guard functions
│   ├── layouts/            # Shared layout components
│   ├── mocks/              # Test mocks for store/entry
│   ├── store/              # Store/session helpers
│   ├── types/              # Shared TypeScript types/interfaces
│   └── utils/              # Utility functions for form flows
```

---

## Usage

Use the Nx aliases from `tsconfig.base.json` for all shared MHF imports. Do not use relative imports.

---

## Extending in Apps

Apps extend the MHF library foundation to add app-specific behavior:

### Type Extension Pattern

Extend base interfaces to add app-specific properties:

```typescript
import { FlowConfig } from '@maps-react/mhf/types';

// Extend with app-specific properties
export interface ContactFlowConfig extends FlowConfig {
  showBookingReferenceField?: boolean;
  phoneNumberRequired?: boolean;
  autoAdvanceStep?: StepName;
}
```

### Custom Guards

Apps can use custom guards that run via MHF's `runGuardsBase()`:

```typescript
import { runGuardsBase } from '@maps-react/mhf/guards';

export async function myCustomGuard(context: GetServerSidePropsContext) {
  // Custom logic here
}

// In routeConfig.ts
guards: [Guards.COOKIE_GUARD, Guards.MY_CUSTOM_GUARD];
```

### Store Data Extension

Apps can store additional fields in the `EntryData`:

```typescript
const entry = await getStoreEntry(key);
entry.data['custom-field'] = 'value';
await setStoreEntry(key, entry);
```

**See app-specific READMEs for implementation examples:**

- [Contact Forms README](../../apps/moneyhelper-contact-forms/README.md)
- [Booking Forms README](../../apps/moneyhelper-booking-forms/README.md)

---

## Testing

Run all shared library tests:

```bash
# Unit tests with coverage
nx test mhf

# Watch mode
nx test mhf --watch

# Update snapshots
nx test mhf --updateSnapshot
```

All components and utilities in the MHF library have comprehensive unit tests co-located with their implementation.

---

## Accessibility & Language

- All components are accessible and work with keyboard navigation.
- All text uses the translation hooks for Welsh/English support.

---

## Contribution

- Follow MaPS monorepo patterns and strict mode.
- Add unit tests for all new components and helpers.
- Use Nx aliases for all imports.

---

For more details on app-specific flows and architecture, see the [MoneyHelper Contact Forms README](../../apps/moneyhelper-contact-forms/README.md).
