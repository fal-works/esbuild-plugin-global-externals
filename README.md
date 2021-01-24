# esbuild-helper

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
