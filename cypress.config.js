import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "54247ac4",
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/integration/**/*.{js,ts,jsx,tsx}",
    supportFile: false,
  },
  viewportWidth: 1366,
  viewportHeight: 768,
});
