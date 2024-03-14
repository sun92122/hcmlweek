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
    "@nuxtjs/google-fonts",
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

  googleFonts: {
    families: {
      "Noto+Sans+TC": [400, 700],
      "Noto+Serif+TC": [400, 700],
    },
  },

  image: {
    domains: ["i.imgur.com"],
  },

  colorMode: {
    preference: "system",
    fallback: "light",
  },

  app: {
    pageTransition: true,
  },
});
