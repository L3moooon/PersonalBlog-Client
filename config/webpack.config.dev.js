const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// const target = 'http://182.92.105.35:3000'
const target = 'http://127.0.0.1:3000'

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map', // 开发环境推荐 eval-source-map（更快）
  devServer: {
    port: 8080,
    open: true,
    hot: true,
    historyApiFallback: true,
    proxy: [
      {
        context: '/web',
        target,
        changeOrigin: true
      },
      {
        context: '/public',
        target,
        changeOrigin: true
      },
      {
        context: '/images',
        target: 'https://oss.willisblog.cn',
        changeOrigin: true,
        secure: false
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', // 生成静态报告文件
      openAnalyzer: false,   // 析构后不自动打开报告
      reportFilename: 'bundle-report.html', // 报告文件名
    }),
  ]
}