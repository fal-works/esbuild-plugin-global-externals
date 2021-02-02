import * as esbuild from "esbuild";
import type { GlobalsMapper, ModuleType, Options } from "./types";

export type { GlobalsMapper, ModuleType, Options };

const PLUGIN_NAME = "global-externals";

/**
 * Returns a function that determines module type for any specific module path.
 */
const createGetModuleType = <T extends string>(options?: Options<T>) => {
  const moduleType = options?.moduleType;

  if (!moduleType) return (): ModuleType => "esm";
  if (typeof moduleType === "string") return () => moduleType;
  return (modulePath: T) => moduleType(modulePath) || "esm";
};

/**
 * Creates a string for `OnLoadResult.contents`.
 */
const createContents = (moduleType: ModuleType, variableName: string) => {
  switch (moduleType) {
    case "esm":
      return `export default ${variableName};`;
    case "cjs":
      return `module.exports = ${variableName};`;
  }
};

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
  const getModuleType = createGetModuleType(options);

  return {
    name: PLUGIN_NAME,
    setup(build) {
      build.onResolve({ filter: modulePathFilter }, (args) => ({
        path: args.path,
        namespace: PLUGIN_NAME,
      }));

      build.onLoad({ filter: /.*/, namespace: PLUGIN_NAME }, (args) => ({
        contents: createContents(
          /* eslint-disable total-functions/no-unsafe-type-assertion */
          getModuleType(args.path as T),
          getVariableName(args.path as T)
          /* eslint-enable */
        ),
      }));
    },
  };
};

/**
 * Creates a mapper object from an object-form table.
 */
const mapperFromTable = <T extends string>(
  globals: Record<T, string>
): GlobalsMapper<T> => ({
  modulePathFilter: new RegExp(`^(?:${Object.keys(globals).join("|")})$`),
  getVariableName: (modulePath: T) => globals[modulePath],
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
export const globalExternals = <T extends string>(
  globals: Record<T, string>,
  options?: Options<T>
): esbuild.Plugin =>
  globalExternalsWithRegExp(mapperFromTable(globals), options);

export default globalExternals;
