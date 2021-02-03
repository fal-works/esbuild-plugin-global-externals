# esbuild-plugin-global-externals

[esbuild](https://esbuild.github.io/) plugin for replacing imports with global variables.

Similar to `output.globals` option of [Rollup](https://rollupjs.org/).

See also: [evanw/esbuild#337](https://github.com/evanw/esbuild/issues/337)


## Usage example

```js
import { globalExternals } from "@fal-works/esbuild-plugin-global-externals";

/** Mapping from module paths to global variables */
const globals = {
  jquery: "$"
};

esbuild.build({
  entryPoints: ["src/main.js"],
  outfile: "dist/bundle.js",
  bundle: true,
  plugins: [globalExternals(globals)],
});
```

If you prefer `RegExp` use `globalExternalsWithRegExp()` instead, however note that the `RegExp` you'll pass should be valid in Go language as well.


## Options

### Module type

Either `"esm"` (default) or `"cjs"`.

You can also provide an object or a function for specifying the type for each module individually.

```js
globalExternals(globals, {
  moduleType: "cjs"
})
```

### Named exports

An object or a function that specifies names of variables exported from each module.

Without this option, the module type "esm" works only with modules that are imported with default import.

No effect (and no need to use this option) if the module type is `"cjs"`.

```js
globalExternals(globals, {
  namedExports: {
    someModule: ["someExportedVariableName"]
  }
})
```
