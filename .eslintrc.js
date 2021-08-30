module.exports = {
  root: true,
  env: {
   node: true
  },
  plugins: ["es-beautifier"],
  extends: ["plugin:vue/essential", "plugin:es-beautifier/standard", "@vue/typescript"],
  rules: {
   "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
   "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
   "comma-dangle": ["error", "never"],
   "linebreak-style": "off"
  },
  parserOptions: {
   parser: "@typescript-eslint/parser"
  }
 };