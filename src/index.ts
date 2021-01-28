import * as esbuild from "esbuild";

const PLUGIN_NAME = "global-externals";

/**
 * @param globals
 * Mapping from module paths to variable names, e.g. `jquery: "$"`.
 */
export const globalExternals = (
  globals: Record<string, string>
): esbuild.Plugin => {
  const moduleFilter = new RegExp(`^(?:${Object.keys(globals).join("|")})$`);

  return {
    name: PLUGIN_NAME,
    setup(build) {
      build.onResolve({ filter: moduleFilter }, (args) => ({
        path: args.path,
        namespace: PLUGIN_NAME,
      }));

      build.onLoad({ filter: /.*/, namespace: PLUGIN_NAME }, (args) => {
        const variableName = globals[args.path];
        if (!variableName) {
          // Shouldn't happen
          throw new Error(`Unknown module path: ${args.path}`);
        }

        return { contents: `export default ${variableName};` };
      });
    },
  };
};
