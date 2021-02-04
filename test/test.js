import esbuild from "esbuild";
import { globalExternals } from "../lib/index.js";

/**
 * Most simple case.
 */
const testCase = async () => {
  const outfile = "test/bundle.js";

  await esbuild.build({
    entryPoints: ["test/main.js"],
    outfile,
    bundle: true,
    plugins: [globalExternals({ p5: "p5" })],
  });

  console.log(`Emit: ${outfile}`);
};

void testCase();
