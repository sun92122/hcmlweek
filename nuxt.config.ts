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
    "nuxt-cloudflare-analytics",
  ],

  cloudflareAnalytics: {
    // See below for more options
    token: "b09109352b614b4892eaaa859337bd12", // Example 1a2b3v4a5er6ac7r8afd
  },

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
