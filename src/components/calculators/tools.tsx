"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Slider } from "@/components/ui/slider";
import { Input, NativeSelect } from "@/components/ui/field";
import { ApplyButton } from "@/components/apply/ApplyButton";
import { useCountUp } from "./useCountUp";
import { formatINR, formatINRCompact } from "@/lib/format";
import { calculateEmi } from "@/lib/emi";
import {
  sipFutureValue,
  lumpsumFutureValue,
  fdMaturity,
  rdMaturity,
  ppfMaturity,
  compoundInterest,
  incomeTaxNewRegime,
  hraExemption,
  gstCalc,
} from "@/lib/finance";

/* ---------- shared bits ---------- */

function clamp(v: number, min: number, max: number) {
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}

function SliderField({
  label,
  value,
  set,
  min,
  max,
  step,
  fmt,
  decimals,
  suffix,
}: {
  label: string;
  value: number;
  set: (v: number) => void;
  min: number;
  max: number;
  step: number;
  fmt?: (v: number) => string;
  decimals?: boolean;
  suffix?: string;
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
      set(clamp(parsed, min, max));
    }
  };

  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate">{label}</label>
        <div className="flex items-center gap-1">
          <Input
            value={text}
            onChange={(e) => onText(e.target.value)}
            className="num h-9 w-28 text-right text-sm"
            inputMode="decimal"
            aria-label={label}
          />
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => set(v[0])} aria-label={label} />
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground num">
        <span>{fmt ? fmt(min) : min}</span>
        <span>{fmt ? fmt(max) : max}</span>
      </div>
    </div>
  );
}

function ResultPanel({
  headline,
  headlineValue,
  rows,
  pie,
  presetCategory,
  cta = "Apply for a loan",
}: {
  headline: string;
  headlineValue: number;
  rows: { label: string; value: string; dot?: string; strong?: boolean }[];
  pie?: { name: string; value: number; color: string }[];
  presetCategory?: string;
  cta?: string;
}) {
  const display = useCountUp(headlineValue);
  return (
    <div className="rounded-2xl border border-sand bg-ink p-6 text-paper shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-wide text-mint">{headline}</p>
      <p className="num mt-1 text-4xl font-semibold sm:text-5xl">{formatINR(display)}</p>
      {pie && (
        <div className="mt-4 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pie} dataKey="value" innerRadius={38} outerRadius={64} paddingAngle={2} stroke="none">
                {pie.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatINR(Number(v))} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      <dl className="mt-4 space-y-2 text-sm">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-paper/80">
              {r.dot && <span className="h-2 w-2 rounded-full" style={{ background: r.dot }} />}
              {r.label}
            </dt>
            <dd className={`num ${r.strong ? "text-lg font-semibold text-mint" : "text-paper"}`}>{r.value}</dd>
          </div>
        ))}
      </dl>
      <ApplyButton presetCategory={presetCategory} size="lg" className="mt-5 w-full">
        {cta}
      </ApplyButton>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">{children}</div>;
}
function Controls({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-sand bg-white p-6 shadow-soft">{children}</div>;
}

/* ---------- Eligibility ---------- */

export function EligibilityCalculator({ presetCategory }: { presetCategory?: string }) {
  const [income, setIncome] = React.useState(60000);
  const [obligations, setObligations] = React.useState(8000);
  const [rate, setRate] = React.useState(11);
  const [tenure, setTenure] = React.useState(60);
  const [foir, setFoir] = React.useState(50);

  // Max EMI affordable = income*FOIR% − existing obligations
  const maxEmi = Math.max(0, (income * foir) / 100 - obligations);
  // Invert EMI formula to get eligible principal
  const r = rate / 12 / 100;
  const pow = Math.pow(1 + r, tenure);
  const eligible = r === 0 ? maxEmi * tenure : (maxEmi * (pow - 1)) / (r * pow);

  return (
    <Shell>
      <Controls>
        <SliderField label="Net monthly income (₹)" value={income} set={setIncome} min={15000} max={500000} step={5000} fmt={formatINRCompact} />
        <SliderField label="Existing monthly EMIs (₹)" value={obligations} set={setObligations} min={0} max={200000} step={1000} fmt={formatINRCompact} />
        <SliderField label="Interest rate (% p.a.)" value={rate} set={setRate} min={8} max={24} step={0.1} decimals suffix="%" />
        <SliderField label="Tenure (months)" value={tenure} set={setTenure} min={12} max={84} step={6} />
        <SliderField label="FOIR / eligibility ratio (%)" value={foir} set={setFoir} min={40} max={65} step={1} suffix="%" />
      </Controls>
      <ResultPanel
        headline="You may be eligible for up to"
        headlineValue={Math.round(eligible)}
        presetCategory={presetCategory}
        cta="Check my exact eligibility"
        rows={[
          { label: "Max affordable EMI", value: formatINR(Math.round(maxEmi)) },
          { label: "Assumed rate", value: `${rate.toFixed(1)}% p.a.` },
          { label: "Tenure", value: `${tenure} months` },
          { label: "Eligible loan amount", value: formatINR(Math.round(eligible)), strong: true },
        ]}
      />
    </Shell>
  );
}

/* ---------- Balance transfer ---------- */

export function BalanceTransferCalculator() {
  const [outstanding, setOutstanding] = React.useState(800000);
  const [oldRate, setOldRate] = React.useState(14);
  const [newRate, setNewRate] = React.useState(10.5);
  const [months, setMonths] = React.useState(48);
  const [fee, setFee] = React.useState(1);

  const oldEmi = calculateEmi(outstanding, oldRate, months);
  const newEmi = calculateEmi(outstanding, newRate, months);
  const processingFee = (outstanding * fee) / 100;
  const gross = oldEmi.totalPayable - newEmi.totalPayable;
  const net = gross - processingFee;

  return (
    <Shell>
      <Controls>
        <SliderField label="Outstanding balance (₹)" value={outstanding} set={setOutstanding} min={50000} max={10000000} step={50000} fmt={formatINRCompact} />
        <SliderField label="Current interest rate (% p.a.)" value={oldRate} set={setOldRate} min={7} max={26} step={0.1} decimals suffix="%" />
        <SliderField label="New interest rate (% p.a.)" value={newRate} set={setNewRate} min={7} max={26} step={0.1} decimals suffix="%" />
        <SliderField label="Remaining tenure (months)" value={months} set={setMonths} min={6} max={300} step={6} />
        <SliderField label="Processing fee on transfer (%)" value={fee} set={setFee} min={0} max={3} step={0.1} decimals suffix="%" />
      </Controls>
      <ResultPanel
        headline={net >= 0 ? "You could save (net)" : "You would lose (net)"}
        headlineValue={Math.abs(Math.round(net))}
        cta="Apply for a balance transfer"
        rows={[
          { label: "New EMI", value: formatINR(newEmi.emi), dot: "var(--mint)" },
          { label: "Monthly saving", value: formatINR(oldEmi.emi - newEmi.emi) },
          { label: "Gross interest saved", value: formatINR(Math.round(gross)) },
          { label: "Less processing fee", value: formatINR(Math.round(processingFee)) },
          { label: "Net saving", value: formatINR(Math.round(net)), strong: true },
        ]}
      />
    </Shell>
  );
}

/* ---------- Prepayment ---------- */

export function PrepaymentCalculator() {
  const [amount, setAmount] = React.useState(2000000);
  const [rate, setRate] = React.useState(9);
  const [tenure, setTenure] = React.useState(180);
  const [prepay, setPrepay] = React.useState(300000);

  const base = calculateEmi(amount, rate, tenure);
  const reduced = calculateEmi(Math.max(0, amount - prepay), rate, tenure);
  const interestSaved = base.totalInterest - reduced.totalInterest;

  return (
    <Shell>
      <Controls>
        <SliderField label="Loan amount (₹)" value={amount} set={setAmount} min={100000} max={20000000} step={100000} fmt={formatINRCompact} />
        <SliderField label="Interest rate (% p.a.)" value={rate} set={setRate} min={7} max={20} step={0.1} decimals suffix="%" />
        <SliderField label="Tenure (months)" value={tenure} set={setTenure} min={12} max={360} step={12} />
        <SliderField label="One-time prepayment (₹)" value={prepay} set={setPrepay} min={0} max={Math.min(amount, 10000000)} step={50000} fmt={formatINRCompact} />
      </Controls>
      <ResultPanel
        headline="Interest you could save"
        headlineValue={Math.max(0, Math.round(interestSaved))}
        cta="Talk to an advisor"
        rows={[
          { label: "EMI before", value: formatINR(base.emi) },
          { label: "EMI after (same tenure)", value: formatINR(reduced.emi), dot: "var(--mint)" },
          { label: "New EMI saving / month", value: formatINR(base.emi - reduced.emi) },
          { label: "Total interest saved", value: formatINR(Math.max(0, Math.round(interestSaved))), strong: true },
        ]}
      />
    </Shell>
  );
}

/* ---------- Investment (SIP / Lumpsum / FD / RD / PPF / Compound) ---------- */

type InvKind = "sip" | "lumpsum" | "fd" | "rd" | "ppf" | "compound-interest";

export function InvestmentCalculator({ kind }: { kind: InvKind }) {
  const isRecurring = kind === "sip" || kind === "rd";
  const isYearly = kind === "ppf";
  const [amount, setAmount] = React.useState(isYearly ? 150000 : isRecurring ? 10000 : 500000);
  const [rate, setRate] = React.useState(kind === "fd" ? 7 : kind === "ppf" ? 7.1 : 12);
  const [years, setYears] = React.useState(kind === "ppf" ? 15 : 10);

  const res = React.useMemo(() => {
    switch (kind) {
      case "sip":
        return sipFutureValue(amount, rate, years);
      case "lumpsum":
        return lumpsumFutureValue(amount, rate, years);
      case "fd":
        return fdMaturity(amount, rate, years);
      case "rd":
        return rdMaturity(amount, rate, years);
      case "ppf":
        return ppfMaturity(amount, rate, years);
      case "compound-interest":
        return compoundInterest(amount, rate, years, 1);
    }
  }, [kind, amount, rate, years]);

  const amountLabel = isYearly
    ? "Yearly investment (₹)"
    : isRecurring
      ? "Monthly investment (₹)"
      : kind === "fd"
        ? "Deposit amount (₹)"
        : "Investment amount (₹)";

  return (
    <Shell>
      <Controls>
        <SliderField
          label={amountLabel}
          value={amount}
          set={setAmount}
          min={isRecurring ? 500 : 10000}
          max={isRecurring ? 200000 : isYearly ? 150000 : 10000000}
          step={isRecurring ? 500 : 10000}
          fmt={formatINRCompact}
        />
        <SliderField label="Expected return / rate (% p.a.)" value={rate} set={setRate} min={1} max={20} step={0.1} decimals suffix="%" />
        <SliderField label="Time period (years)" value={years} set={setYears} min={1} max={kind === "ppf" ? 40 : 40} step={1} suffix="yrs" />
      </Controls>
      <ResultPanel
        headline="Projected value"
        headlineValue={res.futureValue}
        cta="Plan a loan alongside"
        pie={[
          { name: "Invested", value: res.invested, color: "var(--evergreen)" },
          { name: "Returns", value: Math.max(0, res.gains), color: "var(--mint)" },
        ]}
        rows={[
          { label: "Total invested", value: formatINR(res.invested), dot: "var(--evergreen)" },
          { label: "Est. returns", value: formatINR(res.gains), dot: "var(--mint)" },
          { label: "Maturity value", value: formatINR(res.futureValue), strong: true },
        ]}
      />
    </Shell>
  );
}

/* ---------- Income tax ---------- */

export function IncomeTaxCalculator() {
  const [income, setIncome] = React.useState(1200000);
  const [salaried, setSalaried] = React.useState(true);
  const res = incomeTaxNewRegime(income, salaried);

  return (
    <Shell>
      <Controls>
        <SliderField label="Gross annual income (₹)" value={income} set={setIncome} min={300000} max={5000000} step={50000} fmt={formatINRCompact} />
        <div className="mt-2">
          <label htmlFor="income-type" className="mb-1.5 block text-sm font-medium text-ink">Income type</label>
          <NativeSelect id="income-type" value={salaried ? "salaried" : "other"} onChange={(e) => setSalaried(e.target.value === "salaried")}>
            <option value="salaried">Salaried (₹75,000 standard deduction)</option>
            <option value="other">Business / other</option>
          </NativeSelect>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Based on the New Tax Regime (FY 2025-26) slabs including the §87A rebate up to ₹12,00,000 taxable income and 4%
          cess. Indicative — consult a tax professional for filing.
        </p>
      </Controls>
      <ResultPanel
        headline="Estimated tax payable"
        headlineValue={res.total}
        cta="Explore a loan"
        rows={[
          { label: "Taxable income", value: formatINR(res.taxable) },
          { label: "Income tax", value: formatINR(res.tax) },
          { label: "Health & edu cess (4%)", value: formatINR(res.cess) },
          { label: "Total tax", value: formatINR(res.total), strong: true },
        ]}
      />
    </Shell>
  );
}

/* ---------- HRA ---------- */

export function HraCalculator() {
  const [basic, setBasic] = React.useState(600000);
  const [hra, setHra] = React.useState(300000);
  const [rent, setRent] = React.useState(240000);
  const [metro, setMetro] = React.useState(true);
  const res = hraExemption(basic, hra, rent, metro);

  return (
    <Shell>
      <Controls>
        <SliderField label="Basic salary (₹ / year)" value={basic} set={setBasic} min={100000} max={5000000} step={50000} fmt={formatINRCompact} />
        <SliderField label="HRA received (₹ / year)" value={hra} set={setHra} min={0} max={2500000} step={10000} fmt={formatINRCompact} />
        <SliderField label="Rent paid (₹ / year)" value={rent} set={setRent} min={0} max={2500000} step={10000} fmt={formatINRCompact} />
        <div className="mt-2">
          <label htmlFor="hra-city-type" className="mb-1.5 block text-sm font-medium text-ink">City type</label>
          <NativeSelect id="hra-city-type" value={metro ? "metro" : "non"} onChange={(e) => setMetro(e.target.value === "metro")}>
            <option value="metro">Metro (50% of basic)</option>
            <option value="non">Non-metro (40% of basic)</option>
          </NativeSelect>
        </div>
      </Controls>
      <ResultPanel
        headline="HRA exemption"
        headlineValue={res.exempt}
        cta="Explore a loan"
        rows={[
          { label: "Exempt HRA", value: formatINR(res.exempt), dot: "var(--mint)" },
          { label: "Taxable HRA", value: formatINR(res.taxable) },
        ]}
      />
    </Shell>
  );
}

/* ---------- GST ---------- */

export function GstCalculator() {
  const [amount, setAmount] = React.useState(100000);
  const [rate, setRate] = React.useState(18);
  const [mode, setMode] = React.useState<"add" | "remove">("add");
  const res = gstCalc(amount, rate, mode);

  return (
    <Shell>
      <Controls>
        <SliderField label="Amount (₹)" value={amount} set={setAmount} min={100} max={10000000} step={100} fmt={formatINRCompact} />
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="gst-rate" className="mb-1.5 block text-sm font-medium text-ink">GST rate</label>
            <NativeSelect id="gst-rate" value={String(rate)} onChange={(e) => setRate(Number(e.target.value))}>
              {[0, 3, 5, 12, 18, 28].map((x) => (
                <option key={x} value={x}>
                  {x}%
                </option>
              ))}
            </NativeSelect>
          </div>
          <div>
            <label htmlFor="gst-mode" className="mb-1.5 block text-sm font-medium text-ink">Mode</label>
            <NativeSelect id="gst-mode" value={mode} onChange={(e) => setMode(e.target.value as "add" | "remove")}>
              <option value="add">Add GST (exclusive)</option>
              <option value="remove">Remove GST (inclusive)</option>
            </NativeSelect>
          </div>
        </div>
      </Controls>
      <ResultPanel
        headline={mode === "add" ? "Total incl. GST" : "Base excl. GST"}
        headlineValue={mode === "add" ? res.total : res.base}
        cta="Explore a business loan"
        rows={[
          { label: "Base amount", value: formatINR(res.base) },
          { label: `GST @ ${rate}%`, value: formatINR(res.gst), dot: "var(--saffron)" },
          { label: "Total amount", value: formatINR(res.total), strong: true },
        ]}
      />
    </Shell>
  );
}

/* ---------- Retirement corpus ---------- */

export function RetirementCalculator() {
  const [age, setAge] = React.useState(30);
  const [retireAge, setRetireAge] = React.useState(60);
  const [monthly, setMonthly] = React.useState(15000);
  const [rate, setRate] = React.useState(12);
  const years = Math.max(1, retireAge - age);
  const res = sipFutureValue(monthly, rate, years);

  return (
    <Shell>
      <Controls>
        <SliderField label="Current age" value={age} set={setAge} min={18} max={55} step={1} suffix="yrs" />
        <SliderField label="Retirement age" value={retireAge} set={setRetireAge} min={45} max={70} step={1} suffix="yrs" />
        <SliderField label="Monthly investment (₹)" value={monthly} set={setMonthly} min={1000} max={200000} step={1000} fmt={formatINRCompact} />
        <SliderField label="Expected return (% p.a.)" value={rate} set={setRate} min={4} max={18} step={0.1} decimals suffix="%" />
      </Controls>
      <ResultPanel
        headline="Estimated retirement corpus"
        headlineValue={res.futureValue}
        cta="Plan your finances"
        pie={[
          { name: "Invested", value: res.invested, color: "var(--evergreen)" },
          { name: "Returns", value: Math.max(0, res.gains), color: "var(--mint)" },
        ]}
        rows={[
          { label: "Years to invest", value: `${years} years` },
          { label: "Total invested", value: formatINR(res.invested), dot: "var(--evergreen)" },
          { label: "Est. returns", value: formatINR(res.gains), dot: "var(--mint)" },
          { label: "Corpus at retirement", value: formatINR(res.futureValue), strong: true },
        ]}
      />
    </Shell>
  );
}
