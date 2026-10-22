import type { BenchmarkTable } from "@/data/benchmark-rates";

function bps(prev: number, curr: number) {
  const d = Math.round((curr - prev) * 100);
  if (d === 0) return "—";
  return `${d > 0 ? "+" : "−"}${Math.abs(d)} bps`;
}

/** Renders a lender's MCLR / RLLR benchmark table with change vs previous and a cited source. */
export function BenchmarkRatesTable({ table, lenderName }: { table: BenchmarkTable; lenderName: string }) {
  return (
    <div>
      <p className="mb-4 max-w-3xl text-sm text-slate">{table.summary}</p>
      <div className="overflow-x-auto rounded-xl border border-sand bg-white">
        <table className="w-full text-sm">
          <caption className="sr-only">
            {lenderName} {table.benchmark} effective {table.effectiveLabel}
          </caption>
          <thead>
            <tr>
              <th className="border-b border-sand bg-muted/60 px-4 py-2.5 text-left font-semibold text-ink">Tenor</th>
              <th className="border-b border-sand bg-muted/60 px-4 py-2.5 text-right font-semibold text-ink">Previous</th>
              <th className="border-b border-sand bg-muted/60 px-4 py-2.5 text-right font-semibold text-ink">
                From {table.effectiveLabel}
              </th>
              <th className="border-b border-sand bg-muted/60 px-4 py-2.5 text-right font-semibold text-ink">Change</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r) => (
              <tr key={r.tenor}>
                <td className="border-b border-sand/60 px-4 py-2.5">{r.tenor}</td>
                <td className="num border-b border-sand/60 px-4 py-2.5 text-right">{r.previous.toFixed(2)}%</td>
                <td className="num border-b border-sand/60 px-4 py-2.5 text-right font-semibold text-ink">
                  {r.current.toFixed(2)}%
                </td>
                <td className="num border-b border-sand/60 px-4 py-2.5 text-right">{bps(r.previous, r.current)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Source:{" "}
        <a href={table.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-evergreen underline underline-offset-2">
          {table.sourceName}
        </a>
        . Benchmark rates, not the rate you will be offered. Your rate is the benchmark plus your spread. Confirm current
        rates on {lenderName}&apos;s official website.
      </p>
    </div>
  );
}
