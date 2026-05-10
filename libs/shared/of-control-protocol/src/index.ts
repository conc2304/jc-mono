/**
 * @jc/of-control-protocol
 *
 * TypeScript interfaces and types for the WebSocket contract between
 * the React frontend and the openFrameworks app.
 *
 * Includes:
 * - Connection state
 * - Parameter/control definitions
 * - WebSocket message contracts (client → server, server → client)
 * - Projection corner coordinates (normalized)
 * - Mask asset state
 */

export * from './lib/connection';
export * from './lib/types';
export * from './lib/client-messages';
export * from './lib/server-messages';
