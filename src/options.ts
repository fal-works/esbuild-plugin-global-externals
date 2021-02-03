import type { Options, NormalizedOptions, ModuleType } from "./types";

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
export const normalizeOptions = <T extends string>(
  options: Options<T> = {}
): NormalizedOptions<T> => ({
  getModuleType: createGetModuleType(options.moduleType),
  getNamedExports: createGetNamedExports(options.namedExports),
});
