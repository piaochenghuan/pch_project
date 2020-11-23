import { defineConfig } from 'umi';
const path = require('path');

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  // ],
  chainWebpack(config, { webpack }) {
    // config.merge({

    // })
    // console.log(config.toConfig());
  }
});
