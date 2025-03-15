import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import ReactCompiler from "babel-plugin-react-compiler";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [ReactCompiler],
      },
      root: '.',  // Ensure root is the project root, not /src
      resolve: {
        alias: {
          '/src': '/app/src',  // Map /src to /app/src if needed
        },
      },
    }),
    tailwindcss(),
  ],
});
