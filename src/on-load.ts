import type { ModuleType } from "./types";

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
export const createContents = (
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
