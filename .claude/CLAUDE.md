CLAUDE.md

# CLAUDE.md

## Philosophy

This codebase follows:

-   atomic design principles
-   composition-first architecture
-   modular feature boundaries
-   responsive-first UI design
-   reusable state and behavior patterns

Agents should optimize for:

-   maintainability
-   composability
-   clarity
-   scalability
-   isolated responsibilities

The goal is to build a professional-grade frontend architecture that scales cleanly across:

-   mobile
-   tablet
-   desktop

---

# Core Principles

## 1. Composition Over Monoliths

Prefer:

-   small reusable primitives
-   composition
-   isolated behavior
-   modular hooks

Avoid:

-   giant feature components
-   tightly coupled logic
-   deeply nested conditionals
-   duplicated UI behavior

---

## 2. Build From Atoms Upward

Always follow the hierarchy:

```text
Atoms → Molecules → Organisms → Pages
```

### Atoms

Smallest reusable primitives.

Examples:

-   Button
-   IconButton
-   Input
-   Slider
-   Toggle
-   Label
-   Badge
-   Divider
-   Surface

Atoms:

-   contain minimal logic
-   should be highly reusable
-   should avoid feature-specific knowledge

---

### Molecules

Combinations of atoms that form functional UI groups.

Examples:

-   ToolbarGroup
-   SegmentedControl
-   BrushControls
-   UploadActions
-   StatusIndicator

Molecules:

-   compose atoms
-   encapsulate localized interaction patterns
-   should remain reusable across features

---

### Organisms

Feature-level composed sections.

Examples:

-   MaskToolbar
-   MaskCanvas
-   UploadPanel
-   EditorFooter
-   SceneControls

Organisms:

-   orchestrate molecules
-   may contain feature-specific logic
-   should still remain modular

---

### Pages

Pages assemble organisms into complete experiences.

Pages:

-   should contain minimal UI logic
-   should orchestrate layout and state composition
-   should avoid implementing business logic directly

---

# Architecture Rules

## Before Creating A New Component

Agents MUST:

1. Search for an existing atom/molecule first.
2. Prefer extension through composition.
3. Only create new primitives if reuse is impossible.
4. Avoid duplicate UI abstractions.

Do NOT create:

-   near-duplicate components
-   one-off wrappers
-   feature-specific primitives unless necessary

---

# State Management Rules

## Keep State Local When Possible

Prefer:

-   localized component state
-   feature-scoped hooks
-   explicit state ownership

Avoid:

-   unnecessary global state
-   deeply shared mutable state
-   cross-feature coupling

---

## Recommended State Hierarchy

### Atom State

Visual-only state:

-   hover
-   active
-   focus
-   pressed

### Molecule State

Localized interaction state:

-   segmented selection
-   open/closed
-   temporary input state

### Organism State

Feature workflows:

-   editing
-   loading
-   saving
-   viewport state

### App/Page State

Global orchestration only:

-   routing
-   auth
-   session
-   persistent application settings

---

# Hooks & Business Logic

Business logic should live in:

-   hooks
-   services
-   state modules

NOT inside render-heavy UI components.

Prefer:

```ts
useMaskEditor();
useViewport();
useBrushSettings();
```

Avoid:

-   API calls directly in large UI components
-   complex inline state orchestration
-   duplicated effect logic

---

# Responsive Design Rules

This product is responsive across:

-   desktop
-   tablet
-   mobile

Agents MUST treat:

-   mobile as first-class
-   desktop as adaptive
-   canvas/content as primary

---

## Responsive Priorities

### Desktop

-   information density acceptable
-   persistent controls allowed
-   multi-column layouts encouraged

### Tablet

-   reduced chrome
-   compact toolbars
-   adaptive layouts

### Mobile

-   canvas/content first
-   edge-attached controls
-   reduced persistent UI
-   larger touch targets
-   simplified toolbar density

---

# Layout Principles

## Preserve Visual Hierarchy

Priority order:

1. Primary content/canvas
2. Active interaction controls
3. Supporting controls
4. Secondary metadata

---

## Avoid Dead Space

Do NOT:

-   center small controls inside large empty containers
-   create oversized control regions
-   waste vertical space with detached toolbars

Prefer:

-   grouped controls
-   bounded surfaces
-   compact orchestration
-   intentional spacing

---

# Toolbar Rules

Toolbars should:

-   group controls by intent
-   separate tool selection from operation state
-   maintain strong active states
-   scale responsively

Preferred grouping:

```text
[ Tools ] [ Operation ] [ History ] [ View ]
```

---

# Interaction State Rules

Only one active tool at a time.

Operation state should remain independent.

Example:

```text
activeTool = "brush"
activeOperation = "subtract"
```

Avoid fragmented states like:

```text
eraseBrush
subtractBrush
addLasso
```

---

# Visual Design Rules

## Prefer Clear State Visibility

Active states must:

-   be visually obvious
-   use strong contrast
-   avoid subtle-only indicators

Do NOT rely solely on:

-   border color
-   tiny dots
-   weak glow

---

## Surface Hierarchy

Use:

-   surfaces
-   elevation
-   borders
-   grouped containers

to establish:

-   hierarchy
-   grouping
-   focus

Avoid:

-   floating disconnected controls
-   flat unstructured layouts

---

# Accessibility Rules

All components must support:

-   keyboard navigation
-   screen readers
-   visible focus states
-   sufficient contrast
-   touch accessibility

Minimum touch target:

-   44x44px

---

# Performance Rules

Avoid:

-   unnecessary rerenders
-   deeply nested render trees
-   inline object/function recreation in hot paths

Prefer:

-   memoized selectors
-   isolated rendering boundaries
-   lazy-loaded feature modules
-   virtualization where appropriate

---

# File Structure Guidelines

Recommended structure:

```text
/components
  /atoms
  /molecules
  /organisms

/features
  /mask-editor
  /projection
  /scene

/hooks
/services
/state
/pages
```

---

# Component Rules

## Components Should

-   have a single responsibility
-   remain composable
-   expose minimal APIs
-   avoid prop explosion

---

## Avoid Components Larger Than ~300 Lines

If a component exceeds:

-   ~300 lines
-   multiple responsibilities
-   deeply nested rendering

Agents should refactor into:

-   smaller molecules
-   hooks
-   sub-organisms

---

# Styling Rules

Prefer:

-   design tokens
-   semantic spacing
-   reusable layout primitives

Avoid:

-   magic numbers
-   inconsistent spacing
-   one-off overrides

---

# Feature Isolation

Features should:

-   own their own hooks
-   own their own state
-   expose minimal external APIs

Avoid:

-   feature leakage
-   cross-feature imports
-   shared mutable logic

---

# Agent Expectations

Agents should:

-   think composition-first
-   optimize for long-term maintainability
-   reuse existing primitives aggressively
-   reduce UI redundancy
-   preserve responsive behavior
-   favor explicit architecture

Agents MUST:

-   search existing abstractions before creating new ones
-   preserve design consistency
-   maintain responsive integrity
-   avoid unnecessary complexity

---

# Anti-Patterns

Avoid:

-   giant monolithic components
-   duplicated feature logic
-   prop drilling beyond 2 levels
-   tightly coupled UI/state
-   feature-specific atoms
-   duplicated toolbar implementations
-   desktop-only interaction assumptions
-   modal overload
-   hidden interaction state

---

# Final Principle

Build systems, not screens.

Every feature should:

-   compose cleanly
-   scale responsively
-   remain modular
-   remain understandable
-   remain reusable

The architecture should feel:

-   professional
-   coherent
-   maintainable
-   extensible
-   production-grade
