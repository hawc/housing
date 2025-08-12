import { useCallback, useEffect } from 'react';

export function useDebounce(effect, dependencies, delay) {
  const callback = useCallback(effect, [effect, dependencies]);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
