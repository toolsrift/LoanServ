/**
 * Mirrors what Next.js does at build time, for plain Node:
 * - "@/x" → src/x.ts (the tsconfig path alias)
 * - extensionless relative imports inside src/ or tests/ → ".ts"
 * - "server-only" → an empty module (Next ships its own copy; outside a
 *   React Server environment the real package throws on import)
 */
const SRC = new URL("../src/", import.meta.url);

export async function resolve(specifier, context, next) {
  if (specifier === "server-only") {
    return { url: "data:text/javascript,export {};", shortCircuit: true };
  }
  if (specifier.startsWith("@/")) {
    return next(new URL(`${specifier.slice(2)}.ts`, SRC).href, context);
  }
  const parent = context.parentURL || "";
  if (
    specifier.startsWith(".") &&
    !/\.[cm]?[jt]sx?$|\.json$/.test(specifier) &&
    (parent.includes("/src/") || parent.includes("/tests/"))
  ) {
    return next(`${specifier}.ts`, context);
  }
  return next(specifier, context);
}
