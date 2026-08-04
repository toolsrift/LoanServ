"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Calculator, Gauge } from "lucide-react";
import { EmiCalculator, type EmiCalculatorConfig } from "./EmiCalculator";
import { EligibilityCalculator } from "./tools";

/** Tabbed EMI + Eligibility calculators shown on every loan page. */
export function LoanCalcTabs({ config }: { config: EmiCalculatorConfig }) {
  return (
    <Tabs.Root defaultValue="emi">
      <Tabs.List
        aria-label="Loan calculators"
        className="mb-6 inline-flex gap-1 rounded-xl border border-sand bg-white p-1"
      >
        <Tabs.Trigger value="emi" className={tabClass}>
          <Calculator className="h-4 w-4" /> EMI Calculator
        </Tabs.Trigger>
        <Tabs.Trigger value="eligibility" className={tabClass}>
          <Gauge className="h-4 w-4" /> Eligibility Calculator
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="emi" className="focus-visible:outline-none">
        <EmiCalculator config={config} />
      </Tabs.Content>
      <Tabs.Content value="eligibility" className="focus-visible:outline-none">
        <EligibilityCalculator presetCategory={config.presetCategory} />
      </Tabs.Content>
    </Tabs.Root>
  );
}

const tabClass =
  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate transition-colors hover:text-evergreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-evergreen/30 data-[state=active]:bg-evergreen data-[state=active]:text-white data-[state=active]:shadow-sm";
