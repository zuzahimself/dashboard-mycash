import { useRef, useState, useCallback, useEffect } from 'react';
import { useFinance } from '@/contexts';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CategoryDonutCard, CATEGORY_RING_COLORS } from './CategoryDonutCard';

const SCROLL_STEP = 200;
const FADE_THRESHOLD = 2;
const HOVER_HIDE_DELAY_MS = 400;

export function ExpensesByCategoryCarousel() {
  const { calculateExpensesByCategory, calculateIncomeForPeriod } = useFinance();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const scrollRef = useRef<HTMLDivElement>(null);
  const hoverHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scroll: 0 });

  const byCat = calculateExpensesByCategory();
  const income = calculateIncomeForPeriod();
  const entries = Object.entries(byCat).sort(([, a], [, b]) => b - a);

  const getPercent = useCallback(
    (value: number) => (income <= 0 ? 0 : (value / income) * 100),
    [income]
  );

  const scroll = (dx: number) => {
    const el = scrollRef.current;
    if (el) el.scrollLeft += dx;
  };

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setIsAtStart(el.scrollLeft <= FADE_THRESHOLD);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState);
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

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
    dragStart.current = { x: e.clientX, scroll: scrollRef.current?.scrollLeft ?? 0 };
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    if (scrollRef.current) scrollRef.current.scrollLeft = dragStart.current.scroll - dx;
  };

  const onMouseUp = () => setIsDragging(false);

  const onMouseEnter = useCallback(() => {
    if (hoverHideRef.current) {
      clearTimeout(hoverHideRef.current);
      hoverHideRef.current = null;
    }
    setIsHovering(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsDragging(false);
    if (hoverHideRef.current) clearTimeout(hoverHideRef.current);
    hoverHideRef.current = setTimeout(() => setIsHovering(false), HOVER_HIDE_DELAY_MS);
  }, []);

  useEffect(() => () => { if (hoverHideRef.current) clearTimeout(hoverHideRef.current); }, []);

  if (entries.length === 0) return null;

  return (
    <section
      className="relative w-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Fade esquerdo: escondido quando o primeiro card está à esquerda (scroll no início) */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-6 z-10 bg-gradient-to-r from-background-300 to-transparent transition-opacity duration-200 ${isAtStart ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-6 z-10 bg-gradient-to-l from-background-300 to-transparent"
        aria-hidden
      />

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

      {!isMobile && isHovering && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-1 z-20">
          <button
            type="button"
            onClick={() => scroll(-SCROLL_STEP)}
            className="pointer-events-auto w-10 h-10 rounded-full bg-surface-500 border border-neutral-300 shadow flex items-center justify-center text-neutral-600 hover:bg-neutral-200 hover:border-neutral-400 transition-colors flex-shrink-0"
            aria-label="Rolar para a esquerda"
          >
            <IconChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(SCROLL_STEP)}
            className="pointer-events-auto w-10 h-10 rounded-full bg-surface-500 border border-neutral-300 shadow flex items-center justify-center text-neutral-600 hover:bg-neutral-200 hover:border-neutral-400 transition-colors flex-shrink-0"
            aria-label="Rolar para a direita"
          >
            <IconChevronRight className="w-5 h-5" />
          </button>
        </div>
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
