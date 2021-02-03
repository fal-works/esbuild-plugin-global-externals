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
   * Function that returns a global variable name with which the import
   * statements of `modulePath` should be replaced.
   */
  getVariableName: (modulePath: T) => string;
};

export type ModuleType = "esm" | "cjs";

export type Options<T extends string> = {
  moduleType?:
    | ModuleType
    | Record<T, ModuleType>
    | ((modulePath: T) => ModuleType | undefined);
  namedExports?:
    | Record<T, readonly string[]>
    | ((modulePath: T) => readonly string[]);
};

export type NormalizedOptions<T extends string> = {
  getModuleType: (modulePath: T) => ModuleType;
  getNamedExports: (modulePath: T) => readonly string[] | null;
};
