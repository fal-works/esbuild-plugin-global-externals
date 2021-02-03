import type * as esbuild from "esbuild";
import type {
  GlobalsMapper,
  ModuleType,
  ModuleInfo,
  NormalizedModuleInfo,
} from "./types";
import { createContents } from "./on-load.js";

export type { GlobalsMapper, ModuleType, ModuleInfo, NormalizedModuleInfo };

const PLUGIN_NAME = "global-externals";

const normalizeModuleInfo = (
  value: string | ModuleInfo
): NormalizedModuleInfo => {
  const { type = "esm", varName, namedExports = null } =
    typeof value === "string" ? { varName: value } : value;

  return { type, varName, namedExports };
};

/**
 * Create a `Plugin` for replacing modules with corresponding global variables.
 *
 * @param globals See type declaration.
 */
export const globalExternalsWithRegExp = <T extends string>(
  globals: GlobalsMapper<T>
): esbuild.Plugin => {
  const { modulePathFilter, getModuleInfo } = globals;

  return {
    name: PLUGIN_NAME,
    setup(build) {
      build.onResolve({ filter: modulePathFilter }, (args) => ({
        path: args.path,
        namespace: PLUGIN_NAME,
      }));

      build.onLoad({ filter: /.*/, namespace: PLUGIN_NAME }, (args) => {
        // eslint-disable-next-line total-functions/no-unsafe-type-assertion
        const modulePath = args.path as T;
        const moduleInfo = normalizeModuleInfo(getModuleInfo(modulePath));
        return { contents: createContents(moduleInfo) };
      });
    },
  };
};

/**
 * Create a `Plugin` for replacing modules with corresponding global variables.
 *
 * @param globals Object that maps between the two below:
 *
 * - From: Module path used in any `import` statements that should be replaced
 *   with a global variable.
 * - To: String for a global variable name, or any `ModuleInfo` object
 *   which also includes the global variable name.
 *
 * @example
 *
 * ```
 * const plugins = [globalExternals({ jquery: "$" })];
 * ```
 */
export const globalExternals = <T extends string>(
  globals: Record<T, string | ModuleInfo>
): esbuild.Plugin => {
  const normalizedGlobals: GlobalsMapper<T> = {
    modulePathFilter: new RegExp(`^(?:${Object.keys(globals).join("|")})$`),
    getModuleInfo: (modulePath: T) => globals[modulePath],
  };

  return globalExternalsWithRegExp(normalizedGlobals);
};

export default globalExternals;
