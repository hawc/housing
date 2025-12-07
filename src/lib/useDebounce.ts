import { useCallback, useEffect } from 'react';

export function useDebounce(
  effect: () => void,
  dependencies: unknown[],
  delay: number,
) {
  // eslint-disable-next-line react-hooks/use-memo
  const callback = useCallback(effect, [effect, dependencies]);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
