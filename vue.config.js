const { defineConfig } = require('@vue/cli-service');
const path = require("path");

// const target = 'http://182.92.105.35:3000'
const target = 'http://127.0.0.1:3000'

// 使用异步函数包装配置
module.exports = defineConfig(async () => {
  // 动态导入 ESM 模块
  const { default: AutoImport } = await import('unplugin-auto-import/rspack');
  const { default: Components } = await import('unplugin-vue-components/rspack');
  const { VantResolver } = await import('@vant/auto-import-resolver');

  return {
    transpileDependencies: true,
    chainWebpack: (config) => {
      config.resolve.alias
        .set('@', path.resolve(__dirname, 'src'))
        .set('components', path.resolve(__dirname, 'src/components'))
    },
    configureWebpack: {
      plugins: [
        AutoImport({
          resolvers: [VantResolver()]
        }),
        Components({
          resolvers: [VantResolver()]
        }),
      ],
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
  }
});