import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

// Minimal browser globals for the client-side helpers.
const store = new Map<string, string>();
const g = globalThis as Record<string, unknown>;
g.localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) };
const win: { location: { search: string; pathname: string; host: string } } = { location: { search: "", pathname: "/", host: "loanserv.in" } };
g.window = win;
g.document = { referrer: "" };

const A = await import("../src/lib/attribution");

function visit(url: string, referrer = "") {
  const u = new URL(url, "https://loanserv.in");
  win.location = { search: u.search, pathname: u.pathname, host: u.host };
  (g.document as { referrer: string }).referrer = referrer;
  A.captureAttribution();
}
const label = () => A.channelLabel(A.getAttribution());

beforeEach(() => store.clear());

test("organic visit keeps credit across a direct return", () => {
  visit("/loans/home-loan", "https://www.google.com/");
  assert.equal(label(), "Organic search (google.com)");
  visit("/apply");
  assert.equal(label(), "Organic search (google.com)");
  assert.equal(A.getAttribution()!.landingPage, "/loans/home-loan");
  assert.equal(A.getAttribution()!.page, "/apply");
});

test("ad clicks are labelled and click ids are never stored", () => {
  visit("/?gclid=abc123&utm_source=google&utm_medium=cpc");
  assert.equal(label(), "Google Ads");
  assert.ok(!JSON.stringify(A.getAttribution()).includes("abc123"));
  visit("/?fbclid=x");
  assert.equal(label(), "Meta Ads");
});

test("partner credit survives other touches and expires after 30 days", () => {
  visit("/?ref=sri-sai-builders");
  visit("/blog/x", "https://www.bing.com/");
  assert.equal(label(), "Partner: sri-sai-builders");
  const a = JSON.parse(store.get("loanserv-attribution")!);
  a.refAt = new Date(Date.now() - 31 * 864e5).toISOString();
  store.set("loanserv-attribution", JSON.stringify(a));
  assert.equal(label(), "Organic search (bing.com)");
});

test("fallbacks", () => {
  visit("/");
  assert.equal(label(), "Direct");
  visit("/?utm_source=newsletter&utm_medium=email");
  assert.equal(label(), "newsletter / email");
  store.set("loanserv-attribution", "{not json");
  assert.equal(label(), "Direct");
  assert.equal(A.channelLabel(undefined), "Unknown");
});
