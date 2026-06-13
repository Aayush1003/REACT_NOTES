# Exercises and Practice Tasks

Examples of hands-on exercises to build competency:

- Implement a custom hook `useUndoableState` with tests.
- Build a complex form with validation, async field checks, and file uploads.
- Create a normalized data store with optimistic updates and rollback.
- Profile a page and fix a rendering bottleneck; document before/after metrics.
- Replace a class-based component tree with hooks and measure bundle size change.

Project ideas:

- Task manager with real-time updates and offline sync.
- AI-assisted note-taking app with server-side model orchestration.

Exercise templates (use these for assessments):

- Template: `useUndoableState`
	- Objective: implement undo/redo stack for arbitrary state
	- Tests: push state changes, undo twice, redo, assert final state

- Template: Complex Form
	- Objective: build a multi-step form with per-step validation, autosave, and file uploads
	- Tests: validate error messages, simulate network error and retry

- Template: Normalized Store
	- Objective: implement entity normalization, optimistic create, and rollback on failure
	- Tests: ensure store remains consistent after failure scenarios

