#!/usr/bin/env node
/**
 * Issues a partner-portal login for a referral partner.
 *
 *   node scripts/create-partner.mjs "Sri Sai Builders" [partner-code]
 *
 * Prints an SQL statement to run in Supabase → SQL Editor, and the access key
 * to give the partner (shown once; only its SHA-256 hash is stored). The code
 * is also their ?ref= tracking code, so reuse the one from /tools/partner-links
 * if they already have one. To revoke: update partners set active = false
 * where code = '...';
 */
import { createHash, randomBytes } from "node:crypto";

const name = (process.argv[2] || "").trim();
if (!name) {
  console.error('Usage: node scripts/create-partner.mjs "Partner Name" [partner-code]');
  process.exit(1);
}
const code = (process.argv[3] || name)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 60);
if (!/^[a-z0-9][a-z0-9-]{1,59}$/.test(code)) {
  console.error(`Invalid partner code: "${code}"`);
  process.exit(1);
}

const key = randomBytes(18).toString("base64url"); // 24 characters
const hash = createHash("sha256").update(key, "utf8").digest("hex");
const sql = (v) => `'${v.replace(/'/g, "''")}'`;

console.log(`
-- Run in Supabase → SQL Editor:
insert into public.partners (code, name, key_hash)
values (${sql(code)}, ${sql(name)}, ${sql(hash)})
on conflict (code) do update set name = excluded.name, key_hash = excluded.key_hash, active = true;

Give the partner (the key is shown only now):
  Portal:       https://loanserv.in/partner-portal
  Partner code: ${code}
  Access key:   ${key}
`);
