import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseScreenSaverOptions {
  idleTimeoutMs: number;
  onEnter?: () => void;
  onExit?: () => void;
}

const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
] as const;

export function useScreenSaver({
  idleTimeoutMs,
  onEnter,
  onExit,
}: UseScreenSaverOptions) {
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActiveRef = useRef(false);
  const previousCursorRef = useRef<string>('');

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const enter = useCallback(() => {
    if (isActiveRef.current) return;
    isActiveRef.current = true;
    setIsActive(true);
    clearTimer();
    previousCursorRef.current = document.body.style.cursor;
    document.body.style.cursor = 'none';
    onEnter?.();
  }, [clearTimer, onEnter]);

  const exit = useCallback(() => {
    if (!isActiveRef.current) return;
    isActiveRef.current = false;
    setIsActive(false);
    document.body.style.cursor = previousCursorRef.current;
    onExit?.();
    clearTimer();
    timerRef.current = setTimeout(enter, idleTimeoutMs);
  }, [clearTimer, enter, idleTimeoutMs, onExit]);

  const resetIdleTimer = useCallback(() => {
    clearTimer();
    if (isActiveRef.current) return;
    timerRef.current = setTimeout(enter, idleTimeoutMs);
  }, [clearTimer, enter, idleTimeoutMs]);

  const handleActivity = useCallback(
    (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-screen-saver-control]')) {
        if (!isActiveRef.current) {
          resetIdleTimer();
        }
        return;
      }

      if (isActiveRef.current) {
        exit();
      }
      resetIdleTimer();
    },
    [exit, resetIdleTimer]
  );

  useEffect(() => {
    resetIdleTimer();

    ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      clearTimer();
      ACTIVITY_EVENTS.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (isActiveRef.current) {
        document.body.style.cursor = previousCursorRef.current;
        isActiveRef.current = false;
      }
    };
  }, [clearTimer, handleActivity, resetIdleTimer]);

  return { isActive, enter, exit, resetIdleTimer };
}
