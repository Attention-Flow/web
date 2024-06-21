import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  history: { type: 'hash' },
  model: {},
  initialState: {},
  proxy: {
    '/graphql': {
      // target: 'http://192.168.10.2:3001/graphql/',
      target: 'https://attention-flow.xyz//graphql/',
      changeOrigin: true,
      pathRewrite: { '^/graphql': '' },
    },
  },
  request: {},
  // layout: {
  //   title: '@umijs/max',
  // },
  routes: [
    {
      path: '/',
      redirect: '/telegram',
    },
    {
      name: 'Reddit',
      path: '/reddit',
      component: './Reddit',
    },
    {
      name: 'Lens',
      path: '/lens',
      component: './Lens',
    },
    {
      name: 'Telegram',
      path: '/telegram',
      component: './Telegram',
    },
    {
      name: 'Farcaster',
      path: '/farcaster',
      component: './Farcaster',
    },
    {
      path: '/auth/:type',
      component: './Auth',
      layout: false,
    },
  ],
  npmClient: 'yarn',
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
});
