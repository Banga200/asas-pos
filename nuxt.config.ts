// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt','@nuxtjs/i18n'
  ],
  i18n: {
    vueI18n: './nuxt-i18n.js', // custom path example
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
  },
  pinia: {
    storesDirs: ['./store/**']
  },
  nitro: {
    devProxy: {
      '/*': {
        target: 'http://pos.asaspc.net', // Replace with your API URL
        changeOrigin: true, // Optional, but recommended for CORS handling
      },
    },
  },
  app:{
    
    head: {
      htmlAttrs: {
        dir: 'rtl',
        lang: 'ar',
      },
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.BASE_URL
    }
  },
  css: ["@/assets/scss/global.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_variables.scss" as *;'
        }
      }
    }
  },
  routeRules: {
    "/document/**": {ssr: false},
  }
  ,
  dev: false,
  ssr: true
})
