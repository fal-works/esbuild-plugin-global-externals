export type ModuleType = "esm" | "cjs";

export type Options = {
  moduleType?: ModuleType | ((modulePath: string) => ModuleType | undefined);
};
