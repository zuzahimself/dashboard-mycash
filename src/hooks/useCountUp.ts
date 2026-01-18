import { useEffect, useRef, useState } from 'react';

/**
 * Anima de 0 (ou valor anterior) até o alvo em ~durationMs. Ease-out cúbico.
 */
export function useCountUp(value: number, durationMs: number = 800): number {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) {
      setDisplay(to);
      fromRef.current = to;
      return;
    }
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const ease = 1 - (1 - progress) ** 3;
      const current = from + (to - from) * ease;
      setDisplay(current);
      fromRef.current = current;
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, durationMs]);

  return Math.round(display * 100) / 100;
}
