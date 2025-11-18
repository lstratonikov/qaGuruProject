import { defineConfig } from "allure";

export default defineConfig({
  name: "Allure Report",
  output: "./out/allure-report",
  plugins: {
    awesome: {
      options: {
        singleFile: true,
        reportLanguage: "en",
      },
    },
  },
});