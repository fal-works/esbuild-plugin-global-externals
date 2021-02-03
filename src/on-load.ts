import type { NormalizedModuleInfo } from "./module-info";

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
export const createContents = (moduleInfo: NormalizedModuleInfo): string => {
  const { type, varName, namedExports } = moduleInfo;

  switch (type) {
    case "esm":
      return createEsmContents(varName, namedExports);
    case "cjs":
      return createCjsContents(varName);
  }
};
