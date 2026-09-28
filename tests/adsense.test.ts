import { test } from "node:test";
import assert from "node:assert/strict";
import { adsenseClient, adsTxt, adsAllowedOn } from "../src/lib/adsense";

test("adsenseClient accepts real IDs and ignores placeholders", () => {
  assert.equal(adsenseClient("ca-pub-1234567890123456"), "ca-pub-1234567890123456");
  assert.equal(adsenseClient(" pub-1234567890123456 "), "ca-pub-1234567890123456");
  assert.equal(adsenseClient("ca-pub-XXXX"), "");
  assert.equal(adsenseClient(""), "");
  assert.equal(adsenseClient(undefined), "");
});

test("ads.txt publishes Google's seller line only when an ID is set", () => {
  assert.equal(adsTxt("ca-pub-1234567890123456"), "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n");
  assert.match(adsTxt(""), /^# /);
});

test("ads stay off the lead forms, partner login, confirmations and tools", () => {
  for (const p of ["/", "/loans/home-loan", "/blog/doctor-loans-hyderabad", "/calculators/emi-calculator", "/applyx"]) {
    assert.equal(adsAllowedOn(p), true, p);
  }
  for (const p of ["/apply", "/free-cibil-score", "/partner-portal", "/confirm/abc123", "/tools/partner-links"]) {
    assert.equal(adsAllowedOn(p), false, p);
  }
});
