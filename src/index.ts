import * as esbuild from "esbuild";

/**
 * @param globals
 * Mapping from module paths to variable names, e.g. `jquery: "$"`.
 */
export const globalExternals = (
  globals: Record<string, string>
): esbuild.Plugin => {
  const pluginName = "global-externals";
  const moduleFilter = new RegExp(`^(?:${Object.keys(globals).join("|")})$`);

  return {
    name: pluginName,
    setup(build) {
      build.onResolve({ filter: moduleFilter }, (args) => ({
        path: args.path,
        namespace: pluginName,
      }));

      build.onLoad({ filter: /.*/, namespace: pluginName }, (args) => {
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
