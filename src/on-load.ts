import type { NormalizedModuleInfo } from "./module-info";

const createCjsContents = (variableName: string) =>
  `module.exports = ${variableName};`;

const createEsmContents = (
  variableName: string,
  namedExports: readonly string[] | null,
  defaultExport: boolean
) => {
  const defaultExportCode = defaultExport
    ? [`export default ${variableName};`]
    : [];
  const namedExportCode = [...new Set(namedExports)].map(
    (exportName: string) =>
      `const ${exportName} = ${variableName}.${exportName};` +
      `export { ${exportName} };`
  );

  return defaultExportCode.concat(namedExportCode).join("\n");
};

/**
 * Creates value for `OnLoadResult.contents`.
 */
export const createContents = (moduleInfo: NormalizedModuleInfo): string => {
  const { type, varName, namedExports, defaultExport } = moduleInfo;

  switch (type) {
    case "esm":
      return createEsmContents(varName, namedExports, defaultExport);
    case "cjs":
      return createCjsContents(varName);
  }
};
