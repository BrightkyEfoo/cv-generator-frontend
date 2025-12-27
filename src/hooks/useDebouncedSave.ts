import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook for debounced auto-save that:
 * - Skips initial mount
 * - Only saves when data actually changes (JSON comparison)
 * - Uses refs to avoid dependency issues
 * - Cleans up timer on unmount
 */
export function useDebouncedSave<T>(
  data: T,
  onSave: (data: T) => void,
  delay: number = 1500
) {
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const lastSavedRef = useRef<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const isInitialMount = useRef(true);

  const save = useCallback(() => {
    const dataStr = JSON.stringify(data);

    // Skip if data hasn't changed
    if (dataStr === lastSavedRef.current) {
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      lastSavedRef.current = dataStr;
      onSaveRef.current(data);
    }, delay);
  }, [data, delay]);

  // Initialize lastSavedRef with initial data
  useEffect(() => {
    if (isInitialMount.current) {
      lastSavedRef.current = JSON.stringify(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Watch for data changes (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    save();
  }, [save]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
}
