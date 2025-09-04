const { merge } = require('webpack-merge')
const commonConfig = require('./config/webpack.config.common')
const productionConfig = require('./config/webpack.config.prod')
const developmentConfig = require('./config/webpack.config.dev')

module.exports = (env) => {
  switch (true) {
    case env.development:
      return merge(commonConfig, developmentConfig)
    case env.production:
      return merge(commonConfig, productionConfig)
    default:
      return new Error("No matching configuration was found")
  }
}