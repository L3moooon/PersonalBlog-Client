const { defineConfig } = require('@vue/cli-service')
const path = require('path')

// const target = 'http://182.92.105.35:3000'
const target = 'http://127.0.0.1:3000'

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src'))
      .set('components', path.resolve(__dirname, 'src/components'))
  },
  devServer: {
    proxy: {
      '/web': {
        target,
        changeOrigin: true,
      },
      '/public': {
        target,
        changeOrigin: true,
      }
    }
  }
})