import type { SpawnConfig } from '../models/types';

function isJsonResponse(res: Response): boolean {
  return (res.headers.get('content-type') ?? '').includes('application/json');
}

export async function loadSpawnConfigs(maskId: string, baseUrl = ''): Promise<SpawnConfig[]> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl}/api/spawn-configs/${maskId}`);
  } catch {
    return [];
  }
  if (res.status === 404 || !isJsonResponse(res)) return [];
  if (!res.ok) throw new Error(`Failed to load spawn configs: ${res.status}`);
  return res.json() as Promise<SpawnConfig[]>;
}

export async function saveSpawnConfig(maskId: string, config: SpawnConfig, baseUrl = ''): Promise<SpawnConfig> {
  const res = await fetch(`${baseUrl}/api/spawn-configs/${maskId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error(`Failed to save spawn config: ${res.status}`);
  // Backend not yet implemented — SPA fallback returns HTML; treat as saved with local data.
  if (!isJsonResponse(res)) return config;
  return res.json() as Promise<SpawnConfig>;
}

export async function deleteSpawnConfig(maskId: string, configId: string, baseUrl = ''): Promise<void> {
  const res = await fetch(`${baseUrl}/api/spawn-configs/${maskId}/${configId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete spawn config: ${res.status}`);
}

export async function activateSpawnConfig(maskId: string, configId: string, baseUrl = ''): Promise<void> {
  const res = await fetch(`${baseUrl}/api/spawn-configs/${maskId}/${configId}/activate`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`Failed to activate spawn config: ${res.status}`);
}
