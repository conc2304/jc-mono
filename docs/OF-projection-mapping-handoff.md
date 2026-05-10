# OF App — Projection Mapping Integration Handoff

This document describes exactly what the openFrameworks (OF) app must implement for the projection mapping feature in the fireplace control frontend to work end-to-end.

---

## Transport

All communication is over a WebSocket server the OF app runs at:

```
ws://<device-ip>:8080/ws
```

All messages are JSON objects with a `"type"` string field. The frontend connects automatically and sends `getParamSchema` and `getState` immediately on connect.

---

## Coordinate System

All projection corners use **normalized coordinates**:

- `x`: `0.0` = left edge, `1.0` = right edge
- `y`: `0.0` = top edge, `1.0` = bottom edge

Default (no warp) corners:

```json
{
  "topLeft":     { "x": 0.0, "y": 0.0 },
  "topRight":    { "x": 1.0, "y": 0.0 },
  "bottomRight": { "x": 1.0, "y": 1.0 },
  "bottomLeft":  { "x": 0.0, "y": 1.0 }
}
```

---

## Messages the OF App Must Handle (Client → OF)

### 1. `setProjectionCalibration`

**This is the critical missing piece.** The frontend sends this when the user opens the Projection tab, and the OF app must enter calibration/warp mode in response.

```json
{ "type": "setProjectionCalibration", "enabled": true }
```

```json
{ "type": "setProjectionCalibration", "enabled": false }
```

**Expected OF behavior:**
- `enabled: true` → enter projection calibration mode. The OF app should apply any corner warp it has stored and begin accepting live corner updates.
- `enabled: false` → exit calibration mode, return to normal rendering.

**After receiving this message, the OF app must send back a `projectionChanged` message** reflecting the new state (see below).

---

### 2. `setProjectionCorners`

Sent in real time as the user drags corner handles on the canvas. Can arrive up to ~25 times per second (throttled to 40ms on the frontend).

```json
{
  "type": "setProjectionCorners",
  "corners": {
    "topLeft":     { "x": 0.02, "y": 0.01 },
    "topRight":    { "x": 0.98, "y": 0.03 },
    "bottomRight": { "x": 0.97, "y": 0.99 },
    "bottomLeft":  { "x": 0.01, "y": 0.98 }
  }
}
```

**Expected OF behavior:** Apply the four-corner warp to the output immediately. No ack required.

---

### 3. `setProjectionCorner` (single corner variant)

Sends one corner at a time. Same coordinate system.

```json
{
  "type": "setProjectionCorner",
  "corner": "topLeft",
  "point": { "x": 0.02, "y": 0.01 }
}
```

---

### 4. `saveProjection`

Sent when the user clicks Save.

```json
{ "type": "saveProjection" }
```

**Expected OF behavior:** Persist current corners to disk (XML, JSON, or whatever the OF app uses). The frontend does not need an ack, but sending one is fine if `requestId` is present.

---

### 5. `resetProjection`

Sent when the user clicks Reset.

```json
{ "type": "resetProjection" }
```

**Expected OF behavior:** Reset corners to the default (full-screen, no warp) and apply immediately. After reset, send a `projectionChanged` message with the default corners.

---

### 6. `setProjectionGrid`

Sent when the user toggles the Test Grid switch.

```json
{ "type": "setProjectionGrid", "enabled": true, "gridSize": 50 }
```

```json
{ "type": "setProjectionGrid", "enabled": false }
```

**Expected OF behavior:** When `enabled`, overlay a calibration grid (lines or checkerboard) on top of the projected output so the user can see warp accuracy. `gridSize` is optional — use a sensible default (e.g. 50px grid cells) if absent.

---

## Messages the OF App Must Send (OF → Client)

### `projectionChanged`

**Must be sent:**
- Once on client connect (so the frontend can initialize its UI with the persisted corners)
- After every `setProjectionCalibration` call
- After every `resetProjection` call
- Optionally after `saveProjection` to confirm `dirty: false`

```json
{
  "type": "projectionChanged",
  "projection": {
    "corners": {
      "topLeft":     { "x": 0.0, "y": 0.0 },
      "topRight":    { "x": 1.0, "y": 0.0 },
      "bottomRight": { "x": 1.0, "y": 1.0 },
      "bottomLeft":  { "x": 0.0, "y": 1.0 }
    },
    "calibrationEnabled": true,
    "testGridEnabled": false,
    "gridSize": 50,
    "dirty": false
  }
}
```

Field definitions:

| Field | Type | Description |
|---|---|---|
| `corners` | `ProjectionCorners` | Current four corner positions in normalized coords |
| `calibrationEnabled` | `boolean` | Whether calibration mode is active |
| `testGridEnabled` | `boolean` | Whether the test grid overlay is on |
| `gridSize` | `number?` | Grid cell size in pixels (optional) |
| `dirty` | `boolean?` | `true` if corners have changed since last save |

---

## On-Connect Sequence

When a client connects, the frontend immediately sends:

```json
{ "type": "getParamSchema" }
{ "type": "getState" }
```

The OF app should reply to `getState` with a `state` message that **includes the current projection state**, or send a `projectionChanged` message independently. Either works — the frontend needs to know the stored corners before the user starts editing.

Recommended: include projection in the initial `state` reply, **and** send a standalone `projectionChanged` so the frontend has a single source of truth for projection.

---

## What Is Broken Right Now (Frontend Side)

These are known frontend bugs that will be fixed once the OF side is confirmed working. Listed here for transparency:

1. **`setProjectionCalibration` is never sent** — the `ProjectionMappingController` has no `useEffect` to send this on mount/unmount. Fix is straightforward.

2. **`projectionChanged` messages are silently dropped** — `OFControlStore` has no `case 'projectionChanged'` in its message handler. The store will be updated to track `projection` state.

3. **`AppShell` always passes `undefined` as the projection prop** — `projection={store.schema ? undefined : undefined}` is a placeholder. It will be changed to `projection={store.projection}` once the store tracks it.

These three fixes are small and will be done on the frontend as soon as the OF app can send and receive the messages above.

---

## Summary Checklist for OF App

- [ ] Handle `setProjectionCalibration` — enter/exit warp mode
- [ ] Handle `setProjectionCorners` — apply live four-corner warp
- [ ] Handle `setProjectionCorner` — apply single corner update
- [ ] Handle `saveProjection` — persist corners to disk
- [ ] Handle `resetProjection` — reset to full-screen defaults
- [ ] Handle `setProjectionGrid` — overlay calibration grid
- [ ] Send `projectionChanged` on client connect with current stored state
- [ ] Send `projectionChanged` after `setProjectionCalibration`
- [ ] Send `projectionChanged` after `resetProjection`
