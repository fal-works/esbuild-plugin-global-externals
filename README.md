# esbuild-helper

Plugin for [esbuild](https://esbuild.github.io/).

Tells esbuild that given modules are external and also equate to corresponding global variables so that they will be excluded from bundling. Similar to `output.globals` option of [Rollup](https://rollupjs.org/).

See also: [evanw/esbuild#337](https://github.com/evanw/esbuild/issues/337)
