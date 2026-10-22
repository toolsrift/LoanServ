import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateEmi, tenureForEmi, payoff } from "../src/lib/emi";

test("tenureForEmi inverts calculateEmi", () => {
  const { emi } = calculateEmi(4000000, 8.5, 240);
  const n = tenureForEmi(4000000, 8.5, emi);
  assert.ok(Math.abs(n - 240) <= 1, `got ${n}`);
});

test("tenureForEmi returns Infinity when EMI does not cover interest", () => {
  assert.equal(tenureForEmi(1000000, 12, 10000), Infinity);
  assert.equal(tenureForEmi(0, 12, 10000), 0);
});

test("a rate hike with the same EMI lengthens the tenure", () => {
  const { emi } = calculateEmi(4000000, 8.5, 240);
  assert.ok(tenureForEmi(4000000, 8.75, emi) > 240);
});

test("payoff matches the EMI schedule total interest", () => {
  const r = calculateEmi(500000, 12, 36);
  const p = payoff(500000, 12, r.emi);
  assert.equal(p.closes, true);
  assert.ok(Math.abs(p.months - 36) <= 1);
  assert.ok(Math.abs(p.totalInterest - r.totalInterest) < 200, `${p.totalInterest} vs ${r.totalInterest}`);
});

test("payoff flags debts whose EMI only covers interest", () => {
  assert.equal(payoff(100000, 36, 3000).closes, false);
});
