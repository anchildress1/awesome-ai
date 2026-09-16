## Plugin Skeleton (ESM)

```js
const plugin = {
  meta: {
    name: PACKAGE_NAME,
    version: PACKAGE_VERSION,
    namespace: NAMESPACE,
  },
  rules: RULES,
  configs: {},
  // processors: {}
};

export default plugin;
```

---

## Config Assignment

Required whenever a config references `plugin`:

```js
Object.assign(plugin.configs, {
  "flat/recommended": [
    {
      plugins: {
        [plugin.meta.namespace]: plugin,
      },
      rules: {
        // "<namespace>/<ruleId>": "error"
      },
    },
  ],

  "legacy-recommended": {
    plugins: [plugin.meta.namespace],
    rules: {
      // "<namespace>/<ruleId>": "error"
    },
  },
});
```

