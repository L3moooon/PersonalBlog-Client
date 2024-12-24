module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16, // 设计稿的基准值，一般为 16
      propList: ['*'], // 需要进行转换的属性列表
      selectorBlackList: [], // 忽略转换的选择器列表
      replace: true, // 是否直接替换原有单位
      mediaQuery: false, // 是否在媒体查询中进行转换
      minPixelValue: 0 // 最小的转换单位
    }
  }
};