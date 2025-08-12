const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const target = 'http://182.92.105.35:3000'
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src'))
      .set('components', path.resolve(__dirname, 'src/components'))
  },
  devServer: {
    proxy: {
      '/': {
        target,
        changeOrigin: true,
        // pathRewrite: {
        //   '^/web': ''
        // }
      },
      // '/public': {
      //   target: 'http://182.92.105.35:3001',
      //   changeOrigin: true,
      // }
    }
  }
})