import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/** Ponto do fluxo por mês. Estrutura preparada para vir de transações agrupadas. */
export interface FinancialFlowPoint {
  month: string; // 'YYYY-MM'
  receitas: number;
  despesas: number;
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function formatMonth(ym: string): string {
  const m = parseInt(ym.slice(5, 7), 10);
  return MESES[Math.max(0, m - 1)];
}

function formatY(value: number): string {
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`;
  return `R$ ${value}`;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

/** Dados mock fixos para 7 meses. Substituir por agregação de transações por mês. */
function getMockData(): FinancialFlowPoint[] {
  return [
    { month: '2024-01', receitas: 12000, despesas: 8500 },
    { month: '2024-02', receitas: 13500, despesas: 9200 },
    { month: '2024-03', receitas: 11800, despesas: 8100 },
    { month: '2024-04', receitas: 14200, despesas: 9500 },
    { month: '2024-05', receitas: 13800, despesas: 8800 },
    { month: '2024-06', receitas: 15100, despesas: 10200 },
    { month: '2024-07', receitas: 12800, despesas: 9100 },
  ];
}

const CHART_HEIGHT = 300;
const RECEITAS_COLOR = '#d7fe03'; // brand-600
const DESPESAS_COLOR = '#070A10'; // secondary-900

interface FinancialFlowChartProps {
  data?: FinancialFlowPoint[];
}

export function FinancialFlowChart({ data = getMockData() }: FinancialFlowChartProps) {
  return (
    <article className="flex h-full min-h-0 flex-col rounded-shape-16 border border-neutral-300 bg-surface-500 p-space-16 md:p-space-24">
      {/* Título "Fluxo Financeiro" + ícone e legenda */}
      <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-space-12 mb-space-16">
        <div className="flex items-center gap-space-8">
          <span className="flex items-center justify-center w-9 h-9 text-icon-default">
            <IconChart className="w-5 h-5" />
          </span>
          <h2 className="text-heading-xsmall font-heading text-neutral-1100">Fluxo Financeiro</h2>
        </div>
        <div className="flex items-center gap-space-16">
          <div className="flex items-center gap-space-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600" aria-hidden />
            <span className="text-label-small font-label text-neutral-1100">Receitas</span>
          </div>
          <div className="flex items-center gap-space-4">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-900" aria-hidden />
            <span className="text-label-small font-label text-neutral-1100">Despesas</span>
          </div>
        </div>
      </div>

      {/* Gráfico: flex-1 para preencher a altura do card e igualar ao Próximas despesas */}
      <div className="min-h-0 flex-1 w-full overflow-visible" style={{ minHeight: CHART_HEIGHT }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 16, right: 16, left: 4, bottom: 20 }}
          >
            <defs>
              {/* Receitas: gradiente vertical verde-limão 30% opaco → transparente */}
              <linearGradient id="receitasGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={RECEITAS_COLOR} stopOpacity={0.3} />
                <stop offset="100%" stopColor={RECEITAS_COLOR} stopOpacity={0} />
              </linearGradient>
              {/* Despesas: gradiente vertical preto 10% opaco → transparente */}
              <linearGradient id="despesasGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={DESPESAS_COLOR} stopOpacity={0.1} />
                <stop offset="100%" stopColor={DESPESAS_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(0,0,0,0.08)"
              horizontal
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              axisLine={{ stroke: 'rgba(0,0,0,0.12)' }}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />

            <YAxis
              tickFormatter={formatY}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              width={58}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
              isAnimationActive={false}
            />

            {/* Receitas: linha borda verde-limão 3px, preenchimento gradiente */}
            <Area
              type="monotone"
              dataKey="receitas"
              stroke={RECEITAS_COLOR}
              strokeWidth={3}
              fill="url(#receitasGrad)"
            />

            {/* Despesas: linha borda preta 3px, preenchimento gradiente */}
            <Area
              type="monotone"
              dataKey="despesas"
              stroke={DESPESAS_COLOR}
              strokeWidth={3}
              fill="url(#despesasGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload?.length || !label) return null;

  const receitas = payload.find((p) => p.dataKey === 'receitas')?.value ?? 0;
  const despesas = payload.find((p) => p.dataKey === 'despesas')?.value ?? 0;

  return (
    <div className="bg-surface-500 border border-neutral-300 rounded-shape-16 shadow-lg px-space-12 py-space-8 min-w-[180px]">
      <p className="text-label-small font-label text-neutral-1100 mb-space-4">
        {formatMonth(label)}
      </p>
      <p className="text-paragraph-small text-green-600">
        Receitas: {formatMoney(receitas)}
      </p>
      <p className="text-paragraph-small text-secondary-900">
        Despesas: {formatMoney(despesas)}
      </p>
    </div>
  );
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}
