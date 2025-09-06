
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
    client: {
      overlay: false, // 取消webpack编译错误时，浏览器全屏提示错误
      logging: 'info' // 控制台输出信息级别
    },
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
  stats: {
    // 控制控制台输出的信息详细程度
    errors: true,        // 显示错误信息（默认true）
    warnings: true,      // 显示警告信息（默认true）
    errorDetails: true,  // 显示错误的详细信息（如错误位置、堆栈）
    moduleTrace: true,   // 显示错误的模块追踪信息
    all: false           // 关闭所有设置为false，只显示上面开启的信息
  },
  performance: {
    hints: false,        // 关闭性能相关的提示（如文件过大警告）
  },
}