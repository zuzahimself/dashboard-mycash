/**
 * Estrutura unificada para Saldo total, Receitas e Despesas (Figma 2012-2991).
 * Ícone no topo; Content (título + valor com space-8 entre si) embaixo.
 * O espaço entre ícone e Content é preenchido por flex (justify-between).
 */
interface SummaryCardProps {
  icon: React.ReactNode;
  iconClassName: string;
  title: string;
  value: number;
}

export function SummaryCard({ icon, iconClassName, title, value }: SummaryCardProps) {
  return (
    <div
      className="flex h-full flex-[1_0_0] flex-col items-start justify-between self-stretch rounded-shape-16 border border-neutral-300 bg-surface-500 p-space-24"
    >
      <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-shape-16 ${iconClassName}`}>
        {icon}
      </span>
      {/* Content: título e valor agrupados com token space-8 entre eles */}
      <div className="flex flex-col gap-space-8">
        <span className="text-paragraph-small text-neutral-600">{title}</span>
        <p className="text-heading-xsmall font-heading text-neutral-1100">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
        </p>
      </div>
    </div>
  );
}
