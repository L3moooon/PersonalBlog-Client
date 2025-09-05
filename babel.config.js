module.exports = {
  presets: [
    // 替换为标准的 @babel/preset-env
    ['@babel/preset-env', {
      // 自动根据目标浏览器引入 polyfill
      useBuiltIns: 'usage',
      // 指定 core-js 版本（与你安装的 core-js 版本匹配）
      corejs: 3,
      // 只针对浏览器环境
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not dead']
      }
    }]
  ],
  plugins: [
    // 启用 Babel 运行时优化
    '@babel/plugin-transform-runtime'
  ]
}
