import type * as esbuild from "esbuild";
import type { GlobalsMapper, ModuleType, Options } from "./types";
import { normalizeOptions } from "./options.js";
import { createContents } from "./on-load.js";

export type { GlobalsMapper, ModuleType, Options };

const PLUGIN_NAME = "global-externals";

/**
 * Create a `Plugin` for replacing modules with corresponding global variables.
 *
 * @param globals See type declaration.
 */
export const globalExternalsWithRegExp = <T extends string>(
  globals: GlobalsMapper<T>,
  options?: Options<T>
): esbuild.Plugin => {
  const { modulePathFilter, getVariableName } = globals;
  const { getModuleType, getNamedExports } = normalizeOptions(options);

  return {
    name: PLUGIN_NAME,
    setup(build) {
      build.onResolve({ filter: modulePathFilter }, (args) => ({
        path: args.path,
        namespace: PLUGIN_NAME,
      }));

      build.onLoad({ filter: /.*/, namespace: PLUGIN_NAME }, (args) => {
        // eslint-disable-next-line total-functions/no-unsafe-type-assertion
        const modulePath = args.path as T; // type T since already filtered

        const variableName = getVariableName(modulePath);
        const moduleType = getModuleType(modulePath);
        const namedExports = getNamedExports(modulePath);

        return {
          contents: createContents(moduleType, variableName, namedExports),
        };
      });
    },
  };
};

/**
 * Create a `Plugin` for replacing modules with corresponding global variables.
 *
 * @param globals Object that maps module paths to variable names, e.g.:
 *   ```
 *   const globals = { jquery: "$" };
 *   const plugins = [globalExternals(globals)];
 *   ```
 */
export const globalExternals = <T extends string>(
  globals: Record<T, string>,
  options?: Options<T>
): esbuild.Plugin => {
  const normalizedGlobals: GlobalsMapper<T> = {
    modulePathFilter: new RegExp(`^(?:${Object.keys(globals).join("|")})$`),
    getVariableName: (modulePath: T) => globals[modulePath],
  };

  return globalExternalsWithRegExp(normalizedGlobals, options);
};

export default globalExternals;
