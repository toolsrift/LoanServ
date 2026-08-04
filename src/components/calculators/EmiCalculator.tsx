"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/field";
import { ApplyButton } from "@/components/apply/ApplyButton";
import { useCountUp } from "./useCountUp";
import { calculateEmi, amortizationByYear } from "@/lib/emi";
import { formatINR, formatINRCompact } from "@/lib/format";

export interface EmiCalculatorConfig {
  amount?: { min: number; max: number; step: number; default: number; label?: string };
  rate?: { min: number; max: number; step: number; default: number; label?: string };
  tenure?: { min: number; max: number; step: number; default: number; label?: string; unit?: "months" | "years" };
  presetCategory?: string;
  showAmortization?: boolean;
}

const DEFAULTS = {
  amount: { min: 50000, max: 10000000, step: 50000, default: 1000000, label: "Loan amount" },
  rate: { min: 6, max: 24, step: 0.1, default: 11, label: "Interest rate (% p.a.)" },
  tenure: { min: 6, max: 360, step: 6, default: 60, label: "Tenure", unit: "months" as const },
};

export function EmiCalculator({ config = {} }: { config?: EmiCalculatorConfig }) {
  const a = { ...DEFAULTS.amount, ...config.amount };
  const r = { ...DEFAULTS.rate, ...config.rate };
  const t = { ...DEFAULTS.tenure, ...config.tenure };
  const showAmort = config.showAmortization ?? true;

  const [amount, setAmount] = React.useState(a.default);
  const [rate, setRate] = React.useState(r.default);
  const [tenure, setTenure] = React.useState(t.default);

  const tenureMonths = t.unit === "years" ? tenure * 12 : tenure;
  const result = React.useMemo(() => calculateEmi(amount, rate, tenureMonths), [amount, rate, tenureMonths]);
  const schedule = React.useMemo(
    () => (showAmort ? amortizationByYear(amount, rate, tenureMonths) : []),
    [amount, rate, tenureMonths, showAmort],
  );

  const emiDisplay = useCountUp(result.emi);
  const pieData = [
    { name: "Principal", value: result.principal, color: "var(--evergreen)" },
    { name: "Interest", value: result.totalInterest, color: "var(--saffron)" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      {/* Controls */}
      <div className="rounded-2xl border border-sand bg-white p-6 shadow-soft">
        <SliderRow
          label={a.label!}
          value={amount}
          display={formatINR(amount)}
          min={a.min}
          max={a.max}
          step={a.step}
          onChange={setAmount}
          onInput={(v) => setAmount(clamp(v, a.min, a.max))}
          minLabel={formatINRCompact(a.min)}
          maxLabel={formatINRCompact(a.max)}
        />
        <SliderRow
          label={r.label!}
          value={rate}
          display={`${rate.toFixed(1)}%`}
          min={r.min}
          max={r.max}
          step={r.step}
          onChange={setRate}
          onInput={(v) => setRate(clamp(v, r.min, r.max))}
          minLabel={`${r.min}%`}
          maxLabel={`${r.max}%`}
          decimals
        />
        <SliderRow
          label={t.label!}
          value={tenure}
          display={t.unit === "years" ? `${tenure} yrs` : `${tenure} mo`}
          min={t.min}
          max={t.max}
          step={t.step}
          onChange={setTenure}
          onInput={(v) => setTenure(clamp(v, t.min, t.max))}
          minLabel={`${t.min}`}
          maxLabel={`${t.max}`}
        />
      </div>

      {/* Result */}
      <div className="rounded-2xl border border-sand bg-ink p-6 text-paper shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wide text-mint">Monthly EMI</p>
        <p className="num mt-1 text-4xl font-semibold sm:text-5xl">{formatINR(emiDisplay)}</p>

        <div className="mt-4 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={38} outerRadius={64} paddingAngle={2} stroke="none">
                {pieData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => formatINR(Number(v))}
                contentStyle={{ borderRadius: 12, border: "1px solid var(--sand)", fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <Row label="Principal" value={formatINR(result.principal)} dot="var(--evergreen)" />
          <Row label="Total interest" value={formatINR(result.totalInterest)} dot="var(--saffron)" />
          <div className="my-2 h-px bg-paper/15" />
          <Row label="Total payable" value={formatINR(result.totalPayable)} strong />
        </dl>

        <ApplyButton presetCategory={config.presetCategory} size="lg" className="mt-5 w-full">
          Apply &amp; get exact rates
        </ApplyButton>
      </div>

      {/* Amortization */}
      {showAmort && schedule.length > 1 && (
        <div className="rounded-2xl border border-sand bg-white p-6 shadow-soft lg:col-span-2">
          <h3 className="mb-4 font-display text-lg text-ink">Year-by-year breakdown</h3>
          <div className="mb-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schedule} margin={{ left: 4, right: 4 }}>
                <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickFormatter={(v) => formatINRCompact(Number(v))} tickLine={false} axisLine={false} fontSize={11} width={48} />
                <Tooltip formatter={(v) => formatINR(Number(v))} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="principalPaid" name="Principal" stackId="a" fill="var(--evergreen)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="interestPaid" name="Interest" stackId="a" fill="var(--saffron)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Year</th>
                  <th className="py-2 pr-4 text-right font-medium">Principal</th>
                  <th className="py-2 pr-4 text-right font-medium">Interest</th>
                  <th className="py-2 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody className="num">
                {schedule.map((row) => (
                  <tr key={row.year} className="border-b border-sand/60">
                    <td className="py-2 pr-4">{row.year}</td>
                    <td className="py-2 pr-4 text-right">{formatINR(row.principalPaid)}</td>
                    <td className="py-2 pr-4 text-right">{formatINR(row.interestPaid)}</td>
                    <td className="py-2 text-right">{formatINR(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function clamp(v: number, min: number, max: number) {
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}

function SliderRow({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  onInput,
  minLabel,
  maxLabel,
  decimals,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  onInput: (v: number) => void;
  minLabel: string;
  maxLabel: string;
  decimals?: boolean;
}) {
  // Keep a raw text buffer so intermediate states ("11.", "11.50") survive
  // parsing and the field doesn't snap while typing decimals.
  const [text, setText] = React.useState(String(value));
  const lastValue = React.useRef(value);
  React.useEffect(() => {
    if (value !== lastValue.current) {
      lastValue.current = value;
      setText(String(value));
    }
  }, [value]);

  const onText = (raw: string) => {
    setText(raw);
    const parsed = decimals ? parseFloat(raw) : parseInt(raw, 10);
    if (!Number.isNaN(parsed)) {
      lastValue.current = parsed;
      onInput(parsed);
    }
  };

  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-slate">{label}</label>
        <Input
          value={text}
          onChange={(e) => onText(e.target.value)}
          className="num h-9 w-32 text-right text-sm"
          inputMode="decimal"
          aria-label={label}
        />
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} aria-label={label} />
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground num">
        <span>{minLabel}</span>
        <span className="hidden sm:inline">{display}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function Row({ label, value, dot, strong }: { label: string; value: string; dot?: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="flex items-center gap-2 text-paper/80">
        {dot && <span className="h-2 w-2 rounded-full" style={{ background: dot }} />}
        {label}
      </dt>
      <dd className={`num ${strong ? "text-lg font-semibold text-mint" : "text-paper"}`}>{value}</dd>
    </div>
  );
}
