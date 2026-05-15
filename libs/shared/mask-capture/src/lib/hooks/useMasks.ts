import { useState, useEffect, useCallback } from 'react';

export interface Mask {
  id: string;
  name: string;
  active: boolean;
  isDefault?: boolean;
  deletable?: boolean;
  imageUrl?: string;
  thumbUrl?: string;
}

function normalizeMask(mask: Mask): Mask {
  return {
    ...mask,
    thumbUrl: mask.thumbUrl ?? `/api/masks/${mask.id}/thumb`,
    imageUrl: mask.imageUrl ?? `/api/masks/${mask.id}/image`,
  };
}

export function isDefaultMask(mask: Mask): boolean {
  return mask.id === 'default' || mask.name === 'fireplace_mask.png';
}

export function canDeleteMask(mask: Mask): boolean {
  return !isDefaultMask(mask) && mask.deletable !== false;
}

export function useMasks(baseUrl = '') {
  const [masks, setMasks] = useState<Mask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshMasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/api/masks`);
      if (!res.ok) throw new Error('Failed to load masks');
      const data = await res.json();
      const raw: Mask[] = data.masks ?? data;
      setMasks(raw.map(normalizeMask));
    } catch {
      setError('Could not load masks.');
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    refreshMasks();
  }, [refreshMasks]);

  const uploadMask = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${baseUrl}/api/masks/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      await refreshMasks();
    },
    [baseUrl, refreshMasks]
  );

  const activateMask = useCallback(
    async (id: string) => {
      const res = await fetch(`${baseUrl}/api/masks/${id}/activate`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Activate failed');
      await refreshMasks();
    },
    [baseUrl, refreshMasks]
  );

  const deleteMask = useCallback(
    async (mask: Mask) => {
      if (isDefaultMask(mask)) return;
      const res = await fetch(`${baseUrl}/api/masks/${mask.id}`, {
        method: 'DELETE',
      });
      if (res.status === 403) {
        throw new Error('The default fireplace mask cannot be deleted.');
      }
      if (!res.ok) throw new Error('Delete failed');
      await refreshMasks();
    },
    [baseUrl, refreshMasks]
  );

  return {
    masks,
    loading,
    error,
    refreshMasks,
    uploadMask,
    activateMask,
    deleteMask,
  };
}
