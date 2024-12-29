/** @type {import("prettier").Config} */
const config = {
  importOrder: ["<THIRD_PARTY_MODULES>", "^~.*$", "^[./]"],
  importOrderSortSpecifiers: true,
  trailingComma: "all",
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};

export default config;
