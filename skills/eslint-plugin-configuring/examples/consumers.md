## ESLint v9 Flat Config Consumer

```js
import { defineConfig } from "eslint/config";
import myPlugin from "eslint-plugin-yourplugin";

export default defineConfig([
  {
    files: ["**/*.{js,ts}"],
    plugins: {
      [myPlugin.meta.namespace]: myPlugin,
    },
    extends: [`${myPlugin.meta.namespace}/recommended`],
  },
]);
```

---

## ESLint v8 Legacy Consumer (legacy-* strategy)

```jsonc
{
  "plugins": ["yourplugin-namespace"],
  "extends": ["yourplugin-namespace/legacy-recommended"]
}
```

---

## ESLint v8 Legacy Consumer (preserved name strategy)

```jsonc
{
  "plugins": ["yourplugin-namespace"],
  "extends": ["yourplugin-namespace/recommended"]
}
```
