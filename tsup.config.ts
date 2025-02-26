import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/zentropy.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true
});
