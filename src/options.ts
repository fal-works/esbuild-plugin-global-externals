import type { Options, NormalizedOptions, ModuleType } from "./types";

/**
 * Returns a function that determines module type for any specific module.
 */
const createGetModuleType = <T extends string>(
  moduleType: Options<T>["moduleType"]
): ((modulePath: T) => ModuleType) => {
  switch (typeof moduleType) {
    case "undefined":
      return () => "esm";
    case "string":
      return () => moduleType;
    case "object":
      return (modulePath) => moduleType[modulePath];
    case "function":
      return (modulePath) => moduleType(modulePath) || "esm";
    default:
      throw new Error(
        `Invalid value for options.moduleType: ${String(moduleType)}`
      );
  }
};

/**
 * Returns a function that gets names of exported variables from any module.
 */
const createGetNamedExports = <T extends string>(
  namedExports: Options<T>["namedExports"]
): ((modulePath: T) => readonly string[] | null) => {
  switch (typeof namedExports) {
    case "undefined":
      return () => null;
    case "object":
      return namedExports
        ? (modulePath) => namedExports[modulePath]
        : () => null;
    case "function":
      return namedExports;
    default:
      throw new Error(
        `Invalid value for options.namedExports: ${String(namedExports)}`
      );
  }
};

/**
 * Normalizes option fields.
 */
export const normalizeOptions = <T extends string>(
  options: Options<T> = {}
): NormalizedOptions<T> => ({
  getModuleType: createGetModuleType(options.moduleType),
  getNamedExports: createGetNamedExports(options.namedExports),
});
