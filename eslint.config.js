// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const reactRefreshModule = require("eslint-plugin-react-refresh");
const reactRefresh = reactRefreshModule.default ?? reactRefreshModule;

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ["dist/*", ".expo/*"],
  },
  {
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      // Mirrors the web repo's .oxlintrc.json rules
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
]);
