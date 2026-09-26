import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import * as T from "../src/lib/chat-text";

const CONTENT = path.join(process.cwd(), "content");

function contentChunks(): T.KnowledgeChunk[] {
  const out: T.KnowledgeChunk[] = [];
  for (const [sub, base] of [
    ["blog", "/blog"],
    ["knowledge-center/product-info", "/knowledge-center/product-info"],
    ["knowledge-center/tutorials", "/knowledge-center/tutorials"],
  ]) {
    for (const f of fs.readdirSync(path.join(CONTENT, sub))) {
      const { data, content } = matter(fs.readFileSync(path.join(CONTENT, sub, f), "utf8"));
      out.push(...T.chunkMarkdown(content, String(data.title), `${base}/${f.replace(/\.mdx?$/, "")}`));
    }
  }
  return out;
}

test("chunking strips markdown and bounds chunk size", () => {
  const chunks = contentChunks();
  assert.ok(chunks.length > 100);
  assert.ok(chunks.every((c) => c.text.length <= 2800));
  assert.ok(chunks.every((c) => !/\]\(|\*\*|^#/m.test(c.text)));
});

test("BM25 retrieval finds the right article", () => {
  const idx = T.buildIndex(contentChunks());
  const top = (q: string) => T.searchIndex(idx, q, 1)[0]?.url;
  assert.equal(top("documents needed for business loan"), "/blog/documents-needed-for-business-loan");
  assert.equal(top("how to improve my cibil score"), "/blog/how-to-improve-cibil-score");
  assert.equal(top("education loan 80E tax"), "/blog/section-80e-education-loan-tax-benefit");
  assert.deepEqual(T.searchIndex(idx, "the and of", 3), []);
});

test("redactPii removes identifiers but keeps amounts", () => {
  const cases: [string, string][] = [
    ["call me on 9876543210", "call me on [phone removed]"],
    ["+91 98765 43210 please", "[phone removed] please"],
    ["+919876543210", "[phone removed]"],
    ["my pan is ABCDE1234F", "my pan is [PAN removed]"],
    ["aadhaar 1234 5678 9012", "aadhaar [number removed]"],
    ["card 4111-1111-1111-1111", "card [number removed]"],
    ["acct 123456789012345", "acct [number removed]"],
    ["mail ravi.k@gmail.com", "mail [email removed]"],
    ["need 500000 loan, salary 60,000", "need 500000 loan, salary 60,000"],
    ["need 5,00,000 for 36 months at 10.5%", "need 5,00,000 for 36 months at 10.5%"],
    ["1 crore = 10000000", "1 crore = 10000000"],
  ];
  for (const [input, expected] of cases) assert.equal(T.redactPii(input), expected, input);
});

test("cleanReply strips reasoning, flags apply intent and restricts links", () => {
  const known = new Set(["/loans/home-loan", "/calculators/emi-calculator"]);
  const r = T.cleanReply(
    "<think>plan</think>See [home loans](/loans/home-loan) and [EMI](https://loanserv.in/calculators/emi-calculator/) or [evil](https://evil.com) and [fake](/loans/nope).\n\n\n\n[[APPLY]]",
    known,
    "https://loanserv.in",
  );
  assert.equal(r.text, "See [home loans](/loans/home-loan) and [EMI](/calculators/emi-calculator) or evil and fake.");
  assert.equal(r.offerLeadForm, true);
  assert.deepEqual(T.cleanReply("Plain answer.", known, "https://loanserv.in"), { text: "Plain answer.", offerLeadForm: false });
  assert.equal(T.toSitePath("//evil.com/x", "https://loanserv.in"), null);
  assert.equal(T.toSitePath("javascript:alert(1)", ""), null);
});

test("stripThinking and extractJsonObject", () => {
  assert.equal(T.stripThinking("reasoning...</think>Answer"), "Answer");
  assert.equal(T.stripThinking("Answer<think>cut off"), "Answer");
  assert.deepEqual(T.extractJsonObject('```json\n{"category":"Home","amount":5000000}\n```'), { category: "Home", amount: 5000000 });
  assert.equal(T.extractJsonObject("no json"), null);
  assert.equal(T.extractJsonObject("[1,2]"), null);
});

test("isMostlyIndicScript", () => {
  assert.equal(T.isMostlyIndicScript("హోమ్ లోన్ కి ఏ డాక్యుమెంట్లు కావాలి?"), true);
  assert.equal(T.isMostlyIndicScript("होम लोन के लिए कौन से दस्तावेज़ चाहिए"), true);
  assert.equal(T.isMostlyIndicScript("home loan ke liye documents kya chahiye"), false);
  assert.equal(T.isMostlyIndicScript("EMI for 5 లక్షలు loan"), false);
  assert.equal(T.isMostlyIndicScript("12345"), false);
});
