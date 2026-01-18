import { useRef, useState, useCallback } from 'react';
import { useFinance } from '@/contexts';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CategoryDonutCard, CATEGORY_RING_COLORS } from './CategoryDonutCard';

const SCROLL_STEP = 200;

export function ExpensesByCategoryCarousel() {
  const { calculateExpensesByCategory, calculateIncomeForPeriod } = useFinance();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scroll: 0 });
  const hasMoved = useRef(false);

  const byCat = calculateExpensesByCategory();
  const income = calculateIncomeForPeriod();
  const entries = Object.entries(byCat).sort(([, a], [, b]) => b - a);

  // % em relação à receita total; se receita zero, 0%
  const getPercent = useCallback(
    (value: number) => (income <= 0 ? 0 : (value / income) * 100),
    [income]
  );

  const scroll = (dx: number) => {
    const el = scrollRef.current;
    if (el) el.scrollLeft += dx;
  };

  const onWheel = (e: React.WheelEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    const d = e.deltaX !== 0 ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
    if (d !== 0) {
      el.scrollLeft += d;
      e.preventDefault();
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    hasMoved.current = false;
    dragStart.current = { x: e.clientX, scroll: scrollRef.current?.scrollLeft ?? 0 };
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    if (Math.abs(dx) > 4) hasMoved.current = true;
    if (scrollRef.current) scrollRef.current.scrollLeft = dragStart.current.scroll - dx;
  };

  const onMouseUp = () => setIsDragging(false);
  const onMouseLeave = () => {
    setIsDragging(false);
    setIsHovering(false);
  };

  if (entries.length === 0) return null;

  return (
    <section
      className="relative w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={onMouseLeave}
    >
      {/* Máscara de gradiente nas bordas */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-6 z-10 bg-gradient-to-r from-background-300 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-6 z-10 bg-gradient-to-l from-background-300 to-transparent"
        aria-hidden
      />

      {/* Área rolável: wheel horizontal, drag */}
      <div
        ref={scrollRef}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        className="flex gap-space-16 overflow-x-auto overflow-y-hidden py-space-4 pb-space-8 scroll-smooth scrollbar-none"
      >
        {entries.map(([category, value], i) => (
          <CategoryDonutCard
            key={category}
            category={category}
            value={value}
            percent={getPercent(value)}
            color={CATEGORY_RING_COLORS[i % CATEGORY_RING_COLORS.length]}
          />
        ))}
      </div>

      {/* Setas flutuantes: só quando mouse sobre a área e não-mobile; ~200px deslocamento */}
      {!isMobile && isHovering && (
        <>
          <button
            type="button"
            onClick={() => scroll(-SCROLL_STEP)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface-500 border border-neutral-300 shadow flex items-center justify-center text-neutral-600 hover:bg-neutral-200 hover:border-neutral-400 transition-colors"
            aria-label="Rolar para a esquerda"
          >
            <IconChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(SCROLL_STEP)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface-500 border border-neutral-300 shadow flex items-center justify-center text-neutral-600 hover:bg-neutral-200 hover:border-neutral-400 transition-colors"
            aria-label="Rolar para a direita"
          >
            <IconChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </section>
  );
}

function IconChevronLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
