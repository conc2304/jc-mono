# Fireplace Control Frontend — Implementation Plan

**Status:** PLAN PHASE  
**Created:** 2026-05-09  
**Branch:** Single working branch (no merges/pushes)  
**Coordination:** Master project manager with sub-agents (treated as livestock — replace if underperforming)  
**Philosophy:** Atomic commits, user-validated features before testing, efficiency over process

---

## Project Scope

Build a React-based mobile-first responsive control frontend for the openFrameworks fireplace projection app running on a Rock Pi. The frontend communicates via WebSocket (port 8080) and will be served directly by the OF app.

### Integration Points

- **WebSocket:** `ws://<host>:8080/ws` (auto-detected from browser)
- **OF Server:** Port 8080 (CivetWeb)
- **Static serving:** OF app serves built frontend from `bin/data/web/`
- **Current API:** 5 MVP parameters exposed; ~187 total parameters in router

### Existing Constraints & Resources

- Nx monorepo with theme system (`@jc/shared/themes`)
- React 19, MUI 7.2, Emotion styling
- Shared components library (`@jc/shared/components`) with atomic/molecular/organism structure
- TypeScript strict mode
- Mobile-first responsive approach required

---

## Architecture Overview

```
fireplace-control-shell (app)
  │
  ├── uses: of-control-client (lib)
  │          └── WebSocket connection, state store, HTTP upload
  │
  ├── uses: of-control-protocol (lib)
  │          └── TypeScript types for WebSocket contract
  │
  ├── uses: scene-controller (lib)
  │          └── Schema-driven modes, presets, parameters, controls
  │
  ├── uses: projection-mapping-controller (lib) — PHASE 2
  │          └── Mask preview, corner dragging, D-pad nudging
  │
  ├── uses: projection-warp (lib) — PHASE 2
  │          └── Canvas warp utility for normalized corners
  │
  ├── uses: mask-capture (lib) — PHASE 2
  │          └── File upload, camera capture, preview
  │
  ├── uses: mask-editor (lib) — PHASE 2
  │          └── Canvas editor: brush, eraser, lasso, invert, export
  │
  ├── uses: fireplace-control-shared-ui (lib)
  │          └── Reusable controls aligned with design system
  │
  └── uses: @jc/shared/components, @jc/shared/themes
```

---

## Implementation Phases

### PHASE 1 — Foundation & Scene Controller (CURRENT)

**Goal:** Build foundational WebSocket client and basic parameter control UI.

**Acceptance:** User can connect to OF app, view parameter schema, change a parameter, see live updates.

**Deliverables:**

1. **`of-control-protocol` lib**

   - TypeScript interfaces for WebSocket contract:
     - `ConnectionStatus` type
     - `ParamSchema`, `State`, `ParamChanged`, `Error` message types
     - `ClientMessage` discriminated union (SetParam, SetMode, LoadPreset, RequestState, etc.)
     - `ServerMessage` discriminated union (StateMessage, ParamChangedMessage, etc.)
     - `ControlParam`, `ControlSchema` interfaces
     - `ModeSummary`, `PresetSummary` interfaces (for future preset support)
     - `ProjectionState`, `MaskAssetState` interfaces (for Phase 2)
     - `NormalizedPoint` coordinate type

2. **`of-control-client` lib**

   - WebSocket connection manager with auto-reconnect
   - Parameter schema fetching (`getParamSchema`)
   - State sync (`getState`)
   - Command sending (`setParam`)
   - Error handling with error boundaries
   - Connection state observable/React hook
   - HTTP multipart upload client (ready for Phase 2)
   - Request/Ack correlation ID support (ready for Phase 2)

3. **`fireplace-control-shared-ui` lib**

   - Reusable control components:
     - Slider (float/int range controls with throttled updates)
     - Toggle (bool controls)
     - Select/Dropdown (enum controls)
     - Color picker (color controls, if available)
     - Number input (int controls)
   - All styled with design system theme
   - Mobile-first responsive
   - Proper label/description support
   - Accessibility ready (ARIA labels, keyboard nav)

4. **`scene-controller` lib**

   - Schema-driven UI generation from `ControlSchema`
   - Mode selector (enum control for `experienceMode`)
   - Preset selector placeholder (filtered by current mode, Phase 2)
   - Parameter grouping by `group` field
   - Parameter filtering:
     - Show global params (no mode specified)
     - Show current-mode params
     - Filter `readOnly: false`
   - Advanced controls collapsed by default (collapsible groups)
   - Throttled slider updates: 30–60ms throttle during drag
   - Send final value on mouse release
   - Mobile-first layout: stacked vertical on small screens
   - Uses shared-ui controls

5. **`fireplace-control-shell` app**
   - Nx React app (Vite + React Router)
   - App shell layout with header/footer
   - Theme provider setup (use existing theme system)
   - Connection status display in header
   - Responsive layout (mobile-first)
   - Routes ready for Phase 2 features
   - Error boundary wrapping control sections
   - WebSocket connection initialization on mount

**Commits:**

1. Create protocol lib with discriminated union types and message contracts
2. Create shared-ui lib with base control components (Slider, Toggle, Select)
3. Create client lib with WebSocket connection manager and hooks
4. Create scene-controller lib with schema-driven UI generation
5. Create shell app with routing skeleton and integration
6. Integration test: connect, fetch schema, display controls, update parameter

**Validation gate:** User confirms parameter updates flow from UI → OF → back to UI

---

### PHASE 2 — Projection Mapping, Mask Capture & Upload

**Goal:** Add projection corner pinning and image upload plumbing (gated on OF endpoint implementation).

**Deliverables:**

1. **`projection-warp` lib** (utility)

   - Canvas-based warp utility
   - Map normalized corner coordinates (0.0-1.0) to pixel coordinates
   - Compute perspective warp matrix
   - Reusable for preview and editor

2. **`projection-mapping-controller` lib**

   - Canvas preview of current mask with corner handles
   - Display current image from OF `MaskAssetState`
   - Four draggable corners (TL, TR, BR, BL) with normalized coordinates
   - Selected corner visual indicator
   - D-pad nudge controls:
     - Up/down/left/right buttons
     - Nudge amount numeric input (default: 0.005 normalized units)
   - Live preview update on drag
   - Throttle WebSocket updates (30–60ms) during drag
   - Mark state dirty during edits
   - Buttons: Save Calibration, Reset Corners, Revert to Saved
   - Toggle test grid button (sends `setProjectionGrid` message)
   - Mobile-responsive layout (tablet/desktop enhanced)

3. **`mask-capture` lib**

   - File input for image upload (png, jpeg, webp)
   - Camera capture input (phone environment camera)
   - Image preview (thumbnail)
   - Direct upload to OF `POST /api/mask/upload` endpoint
   - Upload progress indicator
   - Success/error feedback
   - Button to open mask-editor instead of direct upload
   - Mobile-first layout

4. **`fireplace-control-shell` updates**
   - Add navigation: Scene, Projection, Mask, Status tabs
   - Projection controller view
   - Mask capture view
   - Shared header showing:
     - Connection status (connected/disconnected/connecting)
     - Current mode
     - Current preset
     - FPS (when available)
     - Dirty calibration indicator
     - Upload progress

**Commits per feature:**

1. Create projection-warp utility lib with canvas warp helpers
2. Create projection-mapping-controller lib with canvas preview
3. Add draggable corner handles to projection-mapping-controller
4. Add D-pad nudge controls and save/reset buttons
5. Create mask-capture lib with file upload
6. Add camera capture support to mask-capture
7. Update shell with tab navigation and shared header

**Validation gate:** User can upload an image, see it in projection preview, drag corners, and updates flow to OF

---

### PHASE 3 — Mask Editor

**Goal:** In-frontend mask editing (paint, eraser, lasso, validation).

**Deliverables:**

1. **`mask-editor` lib**
   - Canvas-based image editor
   - Source image display (background)
   - Editable mask overlay (colored transparency)
   - Brush tool:
     - Add/paint mask (open grout)
     - Adjustable size
     - Optional hardness
   - Eraser tool:
     - Remove mask (blocked stone)
     - Adjustable size
   - Lasso/Polygon fill (if feasible; MVP: brush/eraser first)
   - Invert button (swap black/white semantics)
   - Opacity slider (show source image through overlay)
   - Zoom/Pan controls:
     - Pinch zoom (mobile)
     - Plus/minus buttons (fallback)
   - Undo/Redo stack (at least undo for brush/erase operations)
   - Mask validation:
     - Compute % open grout (black)
     - Compute % blocked stone (white)
     - Warn if all white/all black/too sparse/too dense
     - Check for top-edge openings (if relevant to water)
   - Export PNG (final black/white mask)
   - Upload to OF button
   - Download PNG button
   - Mobile-first UI with proper touch targets
   - Semantic display:
     - "Open Grout" = black in exported mask
     - "Blocked Stone" = white in exported mask

**Commits per feature:**

1. Create mask-editor lib with canvas setup and image loader
2. Add brush and eraser tools with undo stack
3. Add zoom/pan controls and opacity slider
4. Add invert, validation, and export PNG
5. Add upload to OF integration
6. Update shell with mask editor view and route

**Validation gate:** User can paint a mask, undo edits, export PNG, and upload to OF

---

## Atomic Commit Strategy

Each commit should be **independently buildable and runnable**. Use feature flags or skeleton routes if needed.

### Synchronous Sequential Workflow

Agents work **synchronously in sequence**, not parallel. Each agent completes their work, commits atomically, and hands off clean output to the next agent. This avoids coordination overhead, prevents branch conflicts, and maintains clean atomic history.

**Workflow:**

```
Agent FE-A builds Protocol lib → hands off built lib
                                  ↓
                        Agent FE-B builds Shared-UI lib
                        (imports Protocol) → hands off
                                  ↓
                        Agent FE-C builds Client lib
                        (imports Protocol) → hands off
                                  ↓
                        Agent FE-D builds Scene-controller
                        (imports Shared-UI, Client) → hands off
                                  ↓
                        Agent FE-E builds Shell app
                        (imports all Phase 1 libs)

                        [GATE 1: User validates]

                        Continue to PHASE 2...
```

**Benefits:**

- No "waiting on dependencies" feedback loops
- Single branch stays clean, commits stack linearly
- Easy to validate at each handoff
- If agent stuck > 3 cycles, replace with fresh agent and continue immediately
- No parallel merge conflicts to resolve

**PHASE 1 commit sequence (5 agents, ~30-60min each):**

```
Agent FE-A:
  1. [PROTOCOL] Create of-control-protocol lib with discriminated union types

Agent FE-B:
  2. [SHARED-UI] Create fireplace-control-shared-ui lib (Slider, Toggle, Select, ColorPicker)

Agent FE-C:
  3. [CLIENT] Create of-control-client lib with WebSocket connection manager
  4. [CLIENT] Add reconnect logic and state sync hooks

Agent FE-D:
  5. [SCENE] Create scene-controller lib with schema-driven parameter UI
  6. [SCENE] Add mode switcher and parameter grouping

Agent FE-E:
  7. [SHELL] Create fireplace-control-shell app with Vite + React Router
  8. [SHELL] Wire scene-controller into shell and theme provider
  9. [INTEGRATION] End-to-end test: connect → fetch schema → display controls
  10. [POLISH] Mobile-first responsive layout and error boundaries
```

**PHASE 2 commit sequence (after PHASE 1 user validation):**

```
Agent FE-D:
  1. [WARP] Create projection-warp utility lib

Agent FE-F:
  2. [PROJECTION] Create projection-mapping-controller lib with canvas preview
  3. [PROJECTION] Add draggable corner handles and nudge controls
  4. [PROJECTION] Add save/reset/revert buttons and test grid toggle

Agent FE-E:
  5. [MASK] Create mask-capture lib with file upload
  6. [MASK] Add camera capture support

Agent FE-G (or FE-E if available):
  7. [SHELL] Add tab navigation (Scene, Projection, Mask, Status)
  8. [SHELL] Add shared status header and route integration
```

**PHASE 3 commit sequence (after PHASE 2 user validation):**

```
Agent FE-H (or rotate):
  1. [EDITOR] Create mask-editor lib with canvas and brush tool
  2. [EDITOR] Add eraser, undo/redo, and zoom/pan controls
  3. [EDITOR] Add invert, opacity, validation, and export PNG
  4. [EDITOR] Add upload to OF integration

Agent FE-I (or FE-E):
  5. [SHELL] Add mask editor route and view
```

---

## Sub-Agent Assignments (Livestock Model)

**PHASE 1 — Sequential Handoff Chain**

| Agent    | Role                | Output                                | Handoff  |
| -------- | ------------------- | ------------------------------------- | -------- |
| **FE-A** | Protocol Library    | `of-control-protocol` (built)         | → FE-B   |
| **FE-B** | Shared UI Library   | `fireplace-control-shared-ui` (built) | → FE-C   |
| **FE-C** | Client Library      | `of-control-client` (built)           | → FE-D   |
| **FE-D** | Scene Controller    | `scene-controller` (built)            | → FE-E   |
| **FE-E** | Shell + Integration | `fireplace-control-shell` (running)   | → GATE 1 |

**PHASE 2 — Sequential Handoff (after PHASE 1 user validation)**

| Agent    | Role              | Output                                  | Handoff  |
| -------- | ----------------- | --------------------------------------- | -------- |
| **FE-D** | Projection Warp   | `projection-warp` utility               | → FE-F   |
| **FE-F** | Projection Mapper | `projection-mapping-controller` (built) | → FE-E   |
| **FE-E** | Mask Capture      | `mask-capture` (built)                  | → FE-G   |
| **FE-G** | Shell Phase 2     | Shell with tabs + header                | → GATE 2 |

**PHASE 3 — Sequential Handoff (after PHASE 2 user validation)**

| Agent    | Role          | Output                         | Handoff  |
| -------- | ------------- | ------------------------------ | -------- |
| **FE-H** | Mask Editor   | `mask-editor` (built + tested) | → FE-I   |
| **FE-I** | Shell Phase 3 | Shell with editor route        | → GATE 3 |

**Swap policy:** If an agent is stuck > 3 cycles on a single task, replace immediately with a fresh agent. No ceremony, no meetings — just swap and move on.

## Master Project Manager Role

**Responsibility:** Coordinate sub-agents, enforce atomic commits, validate features, manage phase gates.

**Authorities:**

- Assign agents to features
- Swap underperforming agents (no debate, immediate replacement)
- Enforce atomic commit discipline
- Gate features on user validation
- Escalate blockers (3+ cycle rule: research → decision → action)
- Control branch (single branch, user controls all merges)

**Phase Gates (User Validation Required):**

- PHASE 1 complete: "Parameter updates flow UI → OF → UI"
- PHASE 2 complete: "Image upload and corner dragging work"
- PHASE 3 complete: "Mask editing and export work"

**Success Criterion:** All code ships on clean atomic commits with user sign-off. Zero long feedback loops.

---

## Known Constraints & Gaps

### OF Integration not yet implemented:

- File upload endpoint (`POST /api/mask/upload`)
- Projection corner messages (`setProjectionCorner`, `projectionChanged`)
- Preset system messages
- Full parameter registry exposure (only 5 MVP params exposed)

### Frontend assumptions:

- Assume OF will implement these endpoints on demand (contract is agreed)
- Build abstraction layers so swap is easy when OF is ready
- Start with mock data in dev mode if needed

---

## Success Checklist

- [ ] PHASE 1 user validation: "I can change parameters and see them update"
- [ ] PHASE 2 user validation: "I can upload an image and see it in preview"
- [ ] Atomic commits throughout (no monolithic PRs)
- [ ] Theme system used consistently
- [ ] Mobile-first responsive (verified on 3 viewport sizes)
- [ ] No dead code or placeholders left in production branches
- [ ] Error boundaries and connection resilience working
- [ ] Performance acceptable on Rock Pi (TBD: define acceptable FPS/latency)

---

## Next Step

Proceed to **PHASE 1 implementation** with synchronous sequential workflow:

1. **Agent FE-A starts:** Build `of-control-protocol` lib (1 commit)
2. When FE-A commits → **Agent FE-B starts:** Build `fireplace-control-shared-ui` lib (1 commit)
3. When FE-B commits → **Agent FE-C starts:** Build `of-control-client` lib (2 commits)
4. When FE-C commits → **Agent FE-D starts:** Build `scene-controller` lib (2 commits)
5. When FE-D commits → **Agent FE-E starts:** Build `fireplace-control-shell` app (4 commits, includes integration test + polish)

Each handoff is clean — no waiting, no coordination. Branch remains linear, atomic, mergeable.

**GATE 1 (after step 5):** User validates "I can change parameters and see them update"

Then proceed to PHASE 2 with fresh agents on the handoff chain.
