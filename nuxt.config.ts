import { _primary } from "#tailwind-config/theme/accentColor";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
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
  piniaPersistedstate: {
    cookieOptions: {
      path: "/",
      // 1 month
      maxAge: 30 * 24 * 60 * 60,
      sameSite: true,
    },
  },

  colorMode: {
    preference: "system",
    fallback: "light",
  },
});
