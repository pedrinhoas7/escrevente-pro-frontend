# AGENT GUIDELINES FOR escrevente-pro-frontend

This document outlines the essential guidelines for autonomous agents operating within the `escrevente-pro-frontend` repository. Adhering to these standards ensures consistency, maintainability, and high code quality.

## 1. Project Overview

This is a Vue 3 project built with TypeScript, Vite, Pinia for state management, Vue Router for navigation, and Tailwind CSS for styling.

## 2. Build, Lint, and Test Commands

### Build Commands

*   **Start Development Server:**
    ```bash
    npm run dev
    ```
    _Description: Runs the application in development mode with hot-reloading._

*   **Build for Production:**
    ```bash
    npm run build
    ```
    _Description: Compiles TypeScript and bundles the application for production deployment._

*   **Preview Production Build:**
    ```bash
    npm run preview
    ```
    _Description: Serves the production build locally for testing before deployment._

### Linting Commands

No explicit linting commands (`eslint`, `vue-cli-service lint`, etc.) were found in `package.json`. Agents should rely on TypeScript's type checking for code quality. If a linter is introduced in the future, this section should be updated.

### Test Commands

No explicit testing framework or test scripts were found in `package.json` (e.g., `vitest`, `jest`). Therefore, there are no predefined commands for running tests, including single tests. If tests are added to the project, agents should:
1.  Identify the testing framework (e.g., Vitest, Jest).
2.  Determine the command to run all tests (e.g., `npm test`).
3.  Determine the command to run a single test file (e.g., `npm test path/to/my.spec.ts`).
4.  Update this `AGENTS.md` file accordingly.

## 3. Code Style Guidelines

Since no explicit linting or formatting tools (like ESLint or Prettier) were configured, agents must infer and adhere to common best practices for Vue 3 and TypeScript.

### 3.1. General Principles

*   **Readability:** Prioritize clear, concise, and easily understandable code.
*   **Consistency:** Follow existing patterns and styles within the codebase.
*   **Modularity:** Break down complex logic into smaller, reusable functions or components.
*   **Maintainability:** Write code that is easy to modify, debug, and extend.

### 3.2. Imports

*   **Absolute Paths:** Prefer absolute paths for importing modules from the `src` directory (e.g., `@/components/MyComponent.vue`).
*   **Relative Paths:** Use relative paths for sibling or child components/modules.
*   **Ordering:** No strict ordering rules, but group imports by type (e.g., Vue imports, third-party libraries, local components, utilities).

### 3.3. Formatting

*   **Indentation:** Use 2 spaces for indentation.
*   **Quotes:** Prefer single quotes for strings unless double quotes are necessary (e.g., for JSX attributes or within strings containing single quotes).
*   **Trailing Commas:** Use trailing commas for multi-line arrays and objects.
*   **Semicolons:** Do not use semicolons at the end of statements.
*   **Line Length:** Aim for a maximum line length of 100-120 characters to improve readability, breaking lines if necessary.

### 3.4. Types (TypeScript)

*   **Strictness:** Adhere to the strictness configured in `tsconfig.json`.
*   **Explicit Types:** Use explicit types for function arguments, return values, and complex variables where possible. Avoid `any` unless absolutely necessary and justified.
*   **Interfaces/Types:** Define interfaces or types for complex objects and props.
*   **Vue Props:** Define props with `defineProps` and provide type annotations.

### 3.5. Naming Conventions

*   **Components:** PascalCase for component names (e.g., `UserProfile`, `PrimaryButton`). File names should be kebab-case (e.g., `UserProfile.vue` -> `user-profile.vue`).
*   **Variables:** camelCase (e.g., `userName`, `totalCount`).
*   **Functions/Methods:** camelCase (e.g., `fetchData`, `handleClick`).
*   **Constants:** SCREAMING_SNAKE_CASE for global constants (e.g., `API_BASE_URL`).
*   **CSS Classes (Tailwind CSS):** Follow Tailwind CSS conventions.

### 3.6. Error Handling

*   **Asynchronous Operations:** Use `try-catch` blocks for all asynchronous operations (e.g., API calls) to handle potential errors gracefully.
*   **User Feedback:** Provide meaningful feedback to the user in case of errors (e.g., toast notifications, error messages in UI).
*   **Logging:** Log errors appropriately to the console for debugging, or to a centralized logging service if configured.

### 3.7. Vue Specific Guidelines

*   **Composition API:** Prefer the Composition API (`<script setup>`) for new components.
*   **Reactivity:** Use `ref` for primitive values and `reactive` for objects/arrays.
*   **Props/Emits:** Clearly define props and emits using `defineProps` and `defineEmits`.
*   **Styling:** Primarily use Tailwind CSS for styling. For component-specific styles not covered by Tailwind, use `<style scoped>`.

## 4. Cursor/Copilot Rules

No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` files were found. Therefore, there are no specific AI assistant rules defined for this project. Agents should follow the general guidelines in this document.
