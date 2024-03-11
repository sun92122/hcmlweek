import { _primary } from "#tailwind-config/theme/accentColor";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: process.env.NODE_ENV === "production" ? "/nuxt3-generate/" : "/",
    buildAssetsDir: "/static/",
  },

  devtools: {
    enabled: false,

    timeline: {
      enabled: true,
    },
  },

  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],

  pinia: {
    storesDirs: ["~/store/**"],
  },
});
