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
    title: 'nuxt-demo1',
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
  css: [
    '~/assets/tooltip.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/element-ui',
    '~/plugins/axios',
    '~/plugins/icons',
    '~/plugins/tooltip',
    {
      src: '~/plugins/json-view',
      mode: 'client'
    },
    {
      src: '~/plugins/md-editor',
      mode: 'client'
    },
    {
      src: '~/plugins/md-viewer',
      mode: 'client'
    }
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
    '@nuxtjs/auth-next',
    '@nuxtjs/style-resources'
  ],

  auth: {
    strategies: {
      social: {
        scheme: 'oauth2',
        endpoints: {
          authorization: `${process.env.GITLAB_URL}/oauth/authorize`,
          token: undefined,
          userInfo: `${process.env.GITLAB_URL}/api/v4/user`,
          logout: undefined
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
        },
        responseType: 'token',
        grantType: 'authorization_code',
        accessType: undefined,
        redirectUri: process.env.GITLAB_CALLBACK,
        logoutRedirectUri: undefined,
        clientId: process.env.GITLAB_CLIENT_ID,
        scope: ['read_user'],
        state: 'UNIQUE_AND_NON_GUESSABLE',
        codeChallengeMethod: '',
        responseMode: '',
        acrValues: ''
      }
    }
  },

  router: {
    middleware: ['auth']
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    prefix: '/api-service'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['typescript', 'json']
      })
    ]
  },
  watch: ['@/server']
};

export default config;
