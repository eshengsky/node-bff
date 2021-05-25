import path from 'path';
import { NuxtConfig } from '@nuxt/types';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import dotenv from 'dotenv';
const envName = process.env.ENV_NAME || 'development';
console.info(`Current env name: ${envName}`);
const result = dotenv.config({
  path: path.resolve(process.cwd(), `./env/.env.${envName}`)
});
if (result.error) {
  throw result.error;
}
const config: NuxtConfig = {
  server: {
    host: '0.0.0.0',
    port: 4000
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt-demo',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  serverMiddleware: ['~/server/middleware'],

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/element-ui',
    '~/plugins/axios'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    ['@nuxtjs/dotenv', { filename: '/env/.env.' + process.env.ENV_NAME }]
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    prefix: '/api-service'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['typescript']
      })
    ]
  },
  watch: ['@/server']
};

export default config;
