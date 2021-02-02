export type ModuleType = "esm" | "cjs";

export type Options<T extends string> = {
  moduleType?: ModuleType | ((modulePath: T) => ModuleType | undefined);
};
