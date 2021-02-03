export type ModuleType = "esm" | "cjs";

/**
 * Information that discribes a module to be imported.
 */
export type ModuleInfo = {
  /**
   * Global variable name with which the import statements of the module
   * should be replaced.
   */
  varName: string;

  /**
   * Type (either `"esm"` or `"cjs"`) that determines the internal behavior of
   * this plugin. Defaults to `"esm"`.
   */
  type?: ModuleType;

  /**
   * Names of variables that are exported from the module and may be imported
   * from another module.
   * No effect if `type` is `"cjs"`.
   */
  namedExports?: readonly string[];
};

export type NormalizedModuleInfo = {
  varName: string;
  type: ModuleType;
  namedExports: readonly string[] | null;
};

export const normalizeModuleInfo = (
  value: string | ModuleInfo
): NormalizedModuleInfo => {
  const { type = "esm", varName, namedExports = null } =
    typeof value === "string" ? { varName: value } : value;

  return { type, varName, namedExports };
};
