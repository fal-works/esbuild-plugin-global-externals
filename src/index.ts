import * as esbuild from "esbuild";

const PLUGIN_NAME = "global-externals";

/**
 * Object that contains a filter and a mapping function for replacing modules
 * with corresponding global variables.
 */
export type GlobalsMapper = {
  /**
   * Regular expression that match module paths to be processed by this plugin.
   *
   * @see <https://esbuild.github.io/plugins/>
   */
  modulePathFilter: RegExp;

  /**
   * Function that returns a global variable name with which the import
   * statements of `modulePath` should be replaced.
   */
  getVariableName: (modulePath: string) => string;
};

/**
 * Create a `Plugin` for replacing modules with corresponding global variables.
 *
 * @param globals See type declaration.
 */
export const globalExternalsWithRegExp = (
  globals: GlobalsMapper
): esbuild.Plugin => {
  const { modulePathFilter, getVariableName } = globals;

  return {
    name: PLUGIN_NAME,
    setup(build) {
      build.onResolve({ filter: modulePathFilter }, (args) => ({
        path: args.path,
        namespace: PLUGIN_NAME,
      }));

      build.onLoad({ filter: /.*/, namespace: PLUGIN_NAME }, (args) => ({
        contents: `export default ${getVariableName(args.path)};`,
      }));
    },
  };
};

/**
 * Creates a mapper object from an object-form table.
 */
const mapperFromTable = (globals: Record<string, string>): GlobalsMapper => ({
  modulePathFilter: new RegExp(`^(?:${Object.keys(globals).join("|")})$`),
  getVariableName: (modulePath: string) => globals[modulePath] as string,
});

/**
 * Create a `Plugin` for replacing modules with corresponding global variables.
 *
 * @param globals Object that maps module paths to variable names, e.g.:
 *   ```
 *   const globals = { jquery: "$" };
 *   const plugins = [globalExternals(globals)];
 *   ```
 */
export const globalExternals = (
  globals: Record<string, string>
): esbuild.Plugin => globalExternalsWithRegExp(mapperFromTable(globals));

export default globalExternals;
