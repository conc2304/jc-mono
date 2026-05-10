# @jc/shared/of-control-protocol

WebSocket message types and protocol contracts for the Fireplace Control frontend communicating with the openFrameworks app.

## Contents

- **ConnectionState** — WebSocket connection status tracking
- **ControlSchema** — Parameter definitions (modes, presets, controls)
- **ControlParam** — Individual control parameter definition
- **ProjectionState** — Projection mapping state (corners, calibration)
- **MaskAssetState** — Mask/image asset information
- **ClientMessage** — Discriminated union of all client→server messages
- **ServerMessage** — Discriminated union of all server→client messages

## Usage

```typescript
import {
  ConnectionStatus,
  ControlParam,
  ClientMessage,
  ServerMessage,
  ProjectionState,
} from '@jc/shared/of-control-protocol';
```

## Message Types

### Client → Server

- `getParamSchema` — Request full parameter schema
- `getState` — Request current state snapshot
- `setParam` — Set a single parameter value
- `setMode` — Change experience mode
- `setProjectionCorner` — Adjust one corner
- `setProjectionCorners` — Adjust all corners
- (more in expansion)

### Server → Client

- `paramSchema` — Full schema + current values
- `state` — Current state snapshot
- `paramChanged` — Broadcast when a param changes
- `modeChanged` — Broadcast when mode changes
- `error` — Error response
- (more in expansion)
