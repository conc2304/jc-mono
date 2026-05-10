# OF App — Projection Mapping: Implementation Status & Frontend Handoff

This document is the complementary response to `OF-projection-mapping-handoff.md`. It describes what the OF app actually implemented, where the protocol differs from the frontend's spec, and what work remains on the frontend side.

---

## TL;DR

All core projection messages are implemented. **Two protocol mismatches exist** (corner format and calibration-changed event name) that the frontend must adapt to. The calibration overlay draws on the **physical projector output, not in the browser** — the frontend must build its own canvas corner-drag UI.

---

## Transport

WebSocket at `ws://<device-ip>:8080/ws`. HTTP static files served from `bin/data/web/`.

---

## On-Connect Sequence

The OF app does **not** wait for `getParamSchema` / `getState` requests. The moment a WebSocket connection is established, the OF app automatically sends two messages in order:

1. `paramSchema` — full parameter schema (187 params, grouped)
2. `fullState` — current values for all params + projection corners + preset list

```json
{
  "type": "fullState",
  "values": { "...paramId...": "...value...", "...": "..." },
  "projection": {
    "corners": [
      { "x": 0.0, "y": 0.0 },
      { "x": 1.0, "y": 0.0 },
      { "x": 1.0, "y": 1.0 },
      { "x": 0.0, "y": 1.0 }
    ],
    "calibrating": false
  },
  "preset": "currently-active-preset-id",
  "presets": [ { "id": "...", "label": "...", "description": "..." } ]
}
```

The frontend can still send `getParamSchema` / `getState` explicitly — they are handled and return fresh data.

---

## ⚠️ Protocol Mismatches vs. Frontend Spec

### 1. Corner format is an array, not an object with named keys

**Frontend spec expected:**
```json
"corners": {
  "topLeft":     { "x": 0.0, "y": 0.0 },
  "topRight":    { "x": 1.0, "y": 0.0 },
  "bottomRight": { "x": 1.0, "y": 1.0 },
  "bottomLeft":  { "x": 0.0, "y": 1.0 }
}
```

**OF app sends/receives:**
```json
"corners": [
  { "x": 0.0, "y": 0.0 },
  { "x": 1.0, "y": 0.0 },
  { "x": 1.0, "y": 1.0 },
  { "x": 0.0, "y": 1.0 }
]
```

Corner order: index `0` = top-left, `1` = top-right, `2` = bottom-right, `3` = bottom-left.

**Frontend action required:** Update all projection-related store parsing and outbound message builders to use this array format instead of the named-key object.

---

### 2. `setProjectionCorner` uses `index`, not a corner name

**Frontend spec expected:**
```json
{ "type": "setProjectionCorner", "corner": "topLeft", "point": { "x": 0.02, "y": 0.01 } }
```

**OF app expects:**
```json
{ "type": "setProjectionCorner", "index": 0, "x": 0.02, "y": 0.01, "requestId": "..." }
```

Index mapping: `0`=topLeft, `1`=topRight, `2`=bottomRight, `3`=bottomLeft.

---

### 3. `setProjectionCalibration` emits `projectionCalibrationChanged`, not `projectionChanged`

When the frontend sends `setProjectionCalibration`, the OF app broadcasts:

```json
{ "type": "projectionCalibrationChanged", "calibrating": true }
```

(Not `projectionChanged` — that is a separate event used after corner updates and reset.)

**Frontend action required:** Add a `case 'projectionCalibrationChanged'` handler alongside `case 'projectionChanged'` in the store's message dispatcher.

---

### 4. `setProjectionGrid` is not implemented

The OF app has no built-in overlay grid for calibration. `setProjectionGrid` messages are silently rejected with an "Unknown message type" error. The frontend should not send this message.

If a test grid is desired, it should be rendered on the frontend canvas, not requested from the OF app.

---

### 5. `projectionChanged` does not include `dirty`, `testGridEnabled`, or `gridSize`

The OF app's `projectionChanged` shape is lean:

```json
{
  "type": "projectionChanged",
  "projection": {
    "corners": [ ...4 {x,y} objects... ],
    "calibrating": false
  }
}
```

No `dirty`, `testGridEnabled`, or `gridSize` fields. The frontend must track `dirty` state locally (mark dirty when user drags a corner, clear on `saveProjection` ack).

---

## Complete Message Reference

### Client → OF

#### `setProjectionCalibration`

```json
{ "type": "setProjectionCalibration", "enabled": true, "requestId": "opt-uuid" }
```

- Toggles `calibrationMode_` on the `ProjectionMapper`.
- If `enabled` matches current state, no-ops.
- Broadcasts `projectionCalibrationChanged` to all connected clients.
- Sends `ack` if `requestId` is present.

> **What calibration mode actually does:** It shows corner-drag handles on the **physical projector output screen** (the OF app's display window), not in the browser. The browser does not see this overlay. The browser must render its own corner-pin UI using the corner coordinates from `fullState` / `projectionChanged`.

#### `setProjectionCorners`

```json
{
  "type": "setProjectionCorners",
  "corners": [
    { "x": 0.02, "y": 0.01 },
    { "x": 0.98, "y": 0.03 },
    { "x": 0.97, "y": 0.99 },
    { "x": 0.01, "y": 0.98 }
  ],
  "requestId": "opt-uuid"
}
```

- `corners` must be an array of exactly 4 `{x, y}` objects.
- `x` and `y` are clamped to `[0.0, 1.0]`.
- Applies immediately to the projection warp.
- Broadcasts `projectionChanged` to all connected clients (including sender).
- Safe to call at ~25 Hz from a drag handler (no throttle on the OF side).

#### `setProjectionCorner`

```json
{ "type": "setProjectionCorner", "index": 0, "x": 0.02, "y": 0.01, "requestId": "opt-uuid" }
```

- `index`: `0`=topLeft, `1`=topRight, `2`=bottomRight, `3`=bottomLeft.
- Broadcasts `projectionChanged`.

#### `saveProjection`

```json
{ "type": "saveProjection", "requestId": "opt-uuid" }
```

- Saves current corners to `bin/data/projection_calibration.json`.
- Sends `ack`. Does not broadcast `projectionChanged`.

#### `resetProjection`

```json
{ "type": "resetProjection", "requestId": "opt-uuid" }
```

- Resets corners to `[{0,0},{1,0},{1,1},{0,1}]` (full-screen, no warp).
- Broadcasts `projectionChanged` with default corners.

---

### OF → Client

#### `projectionChanged`

Sent after: `setProjectionCorner`, `setProjectionCorners`, `resetProjection`.

```json
{
  "type": "projectionChanged",
  "projection": {
    "corners": [
      { "x": 0.0, "y": 0.0 },
      { "x": 1.0, "y": 0.0 },
      { "x": 1.0, "y": 1.0 },
      { "x": 0.0, "y": 1.0 }
    ],
    "calibrating": false
  }
}
```

#### `projectionCalibrationChanged`

Sent after: `setProjectionCalibration`.

```json
{ "type": "projectionCalibrationChanged", "calibrating": true }
```

#### `ack`

Sent in response to any message that included a `requestId` field.

```json
{ "type": "ack", "requestId": "the-uuid-you-sent", "ok": true }
{ "type": "ack", "requestId": "the-uuid-you-sent", "ok": false, "error": "reason" }
```

---

## Coordinate System

Identical to the frontend spec — normalized to the OF window dimensions:

| Value | Meaning |
|---|---|
| `x = 0.0` | Left edge |
| `x = 1.0` | Right edge |
| `y = 0.0` | Top edge |
| `y = 1.0` | Bottom edge |

Default (no warp): `[{0,0}, {1,0}, {1,1}, {0,1}]` = TL, TR, BR, BL.

---

## Frontend Work Required

The three known bugs from the frontend spec doc are still accurate, plus the protocol adaptations above:

| Item | Status | Action |
|---|---|---|
| `setProjectionCalibration` never sent on mount | Bug — needs fix | Add `useEffect` to send on mount/unmount |
| `projectionChanged` silently dropped | Bug — needs fix | Add `case 'projectionChanged'` to store dispatcher |
| `projectionCalibrationChanged` not handled | New — not in old spec | Add `case 'projectionCalibrationChanged'` to store dispatcher |
| `AppShell` passes `undefined` as projection prop | Bug — needs fix | Change to `projection={store.projection}` |
| Corner format: object → array | Mismatch | Update store parsing and all outbound messages |
| `setProjectionCorner` schema | Mismatch | Use `index`/`x`/`y` instead of `corner`/`point.x`/`point.y` |
| `dirty` tracking | Not in OF | Track locally in the store |
| Canvas corner-drag UI | Not in OF | Build in the browser; `projectionChanged` keeps it in sync |

---

## HTTP Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/mask/upload` | Upload PNG/JPEG/WebP mask (max 10 MB). Returns `{ok, mask:{id, name, imageUrl}}`. All connected WS clients receive `{type:"maskChanged", maskVersion:N}`. |
| `GET` | `/api/mask/current.png` | Serve the active mask image (uploaded or default). Supports cache-busting via `?v=N`. |

All HTTP endpoints include CORS headers (`Access-Control-Allow-Origin: *`). Preflight `OPTIONS` requests are handled for all paths.

---

## SPA Routing

Any extensionless URL (e.g. `/projection`, `/presets`) returns `bin/data/web/index.html`. Static assets with extensions (`.js`, `.css`, `.png`, etc.) are served directly from `bin/data/web/`.
