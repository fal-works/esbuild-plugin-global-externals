import * as esbuild from "esbuild";
import type { GlobalsMapper, ModuleType, Options } from "./types";

export type { GlobalsMapper, ModuleType, Options };

const PLUGIN_NAME = "global-externals";

/**
 * Returns a function that determines module type for any specific module.
 */
const createGetModuleType = <T extends string>(
  moduleType: Options<T>["moduleType"]
): ((modulePath: T) => ModuleType) => {
  if (!moduleType) return () => "esm";
  if (typeof moduleType === "string") return () => moduleType;
  return (modulePath) => moduleType(modulePath) || "esm";
};

/**
 * Returns a function that gets names of exported variables from any module.
 */
const createGetNamedExports = <T extends string>(
  namedExports: Options<T>["namedExports"]
): ((modulePath: T) => readonly string[] | null) => {
  if (!namedExports) return () => null;
  return namedExports;
};

/**
 * Normalizes option fields.
 */
const normalizeOptions = <T extends string>(options: Options<T> = {}) => ({
  getModuleType: createGetModuleType(options.moduleType),
  getNamedExports: createGetNamedExports(options.namedExports),
});

const createCjsContents = (variableName: string) =>
  `module.exports = ${variableName};`;

const convertNamedExport = (variableName: string) => (exportName: string) =>
  `const ${exportName} = ${variableName}.${exportName}; export { ${exportName} };`;

const createEsmContents = (
  variableName: string,
  namedExports: readonly string[] | null
) => {
  return [`export default ${variableName};`]
    .concat([...new Set(namedExports)].map(convertNamedExport(variableName)))
    .join("\n");
};

/**
 * Creates value for `OnLoadResult.contents`.
 */
const createContents = (
  moduleType: ModuleType,
  variableName: string,
  namedExports: readonly string[] | null
): string => {
  switch (moduleType) {
    case "esm":
      return createEsmContents(variableName, namedExports);
    case "cjs":
      return createCjsContents(variableName);
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
