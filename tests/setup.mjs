// Registers module-resolution hooks so `node --test` can run the TypeScript
// sources directly (Node's built-in type stripping) without a bundler.
import { register } from "node:module";

register("./resolve-hooks.mjs", import.meta.url);
