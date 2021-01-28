import * as esbuild from "esbuild";

const PLUGIN_NAME = "global-externals";

/**
 * Object that contains a filter and a mapping function for replacing modules
 * with corresponding global variables.
 */
type GlobalsMapper = {
  /**
   * Regular expression that match module paths to be processed by this plugin.
   */
  modulePathFilter: RegExp;

  /**
   * Function that returns a global variable name with which the import
   * statements of `modulePath` should be replaced.
   */
  getVariableName: (modulePath: string) => string | undefined;
};

/**
 * Creates a mapper object from an object-form table.
 */
const fromTable = (globals: Record<string, string>): GlobalsMapper => ({
  modulePathFilter: new RegExp(`^(?:${Object.keys(globals).join("|")})$`),
  getVariableName: (modulePath: string) => globals[modulePath],
});

/**
 * @param globals
 * Mapping from module paths to variable names, e.g. `jquery: "$"`.
 */
export const globalExternals = (
  globals: Record<string, string>
): esbuild.Plugin => {
  const { modulePathFilter, getVariableName } = fromTable(globals);

  return {
    name: PLUGIN_NAME,
    setup(build) {
      build.onResolve({ filter: modulePathFilter }, (args) => ({
        path: args.path,
        namespace: PLUGIN_NAME,
      }));

      build.onLoad({ filter: /.*/, namespace: PLUGIN_NAME }, (args) => {
        const variableName = getVariableName(args.path);
        if (!variableName) {
          // Shouldn't happen
          throw new Error(`Unknown module path: ${args.path}`);
        }

        return { contents: `export default ${variableName};` };
      });
    },
  };
};
