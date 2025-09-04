const { defineConfig } = require('@vue/cli-service');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require("path");

// const target = 'http://182.92.105.35:3000'
const target = 'http://127.0.0.1:3000'

// 使用异步函数包装配置
module.exports = defineConfig(async () => {
  return {
    transpileDependencies: true,
    chainWebpack: (config) => {
      config.resolve.alias
        .set('@', path.resolve(__dirname, 'src'))
        .set('components', path.resolve(__dirname, 'src/components'))
    },
    configureWebpack: {
      plugins: [
        new BundleAnalyzerPlugin({
          analyzerMode: 'static', // 生成静态报告文件
          openAnalyzer: false,   // 析构后不自动打开报告
          reportFilename: 'bundle-report.html', // 报告文件名
        })
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
        },
        '/images': {
          target: 'https://oss.willisblog.cn',
          changeOrigin: true,
        },
      }
    }
  }
});