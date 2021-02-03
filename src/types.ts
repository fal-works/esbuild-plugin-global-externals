/**
 * Object that contains a filter and a mapping function for replacing modules
 * with corresponding global variables.
 */
export type GlobalsMapper<T extends string = string> = {
  /**
   * Regular expression that match module paths to be processed by this plugin.
   *
   * @see <https://esbuild.github.io/plugins/>
   */
  modulePathFilter: RegExp;

  /**
   * Function that returns either a corresponding global variable name or a
   * `ModuleInfo` object for the module at `modulePath`.
   */
  getModuleInfo: (modulePath: T) => string | ModuleInfo;
};

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
