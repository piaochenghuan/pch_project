import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  // ],
  chainWebpack(config, { webpack }) {
    // config.merge({
    //   mode: 'production'
    // })
    // console.log(config.toConfig());
  }
});
