const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const ESlintPlugin = require('eslint-webpack-plugin');
const path = require('path');

function getStyleLoaders(type = 'css') {
  const loaders = [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader'
  ];
  if (type === 'sass') {
    loaders.push('sass-loader');
  } else if (type === 'less') {
    loaders.push('less-loader');
  }
  return loaders;
}
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    clean: true,
    publicPath: '/', // 根据实际情况设置
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      'components': path.resolve(__dirname, '../src/components'),
    },
    extensions: ['.js', '.vue', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        // 每个文件只匹配其中一个规则，提升构建速度
        oneOf: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // 开启babel编译缓存
              cacheCompression: false // 关闭缓存文件压缩
            }
            // use: {
            //   loader: 'babel-loader',
            //   options: {
            //     presets: ['@babel/preset-env'],
            //     plugins: [
            //       '@babel/plugin-transform-runtime'
            //     ]
            //   },
            // },
          },
          {
            test: /\.css$/,
            use: getStyleLoaders('css'),
          },
          {
            test: /\.s[ac]ss$/i,
            use: getStyleLoaders('sass'),
          },
          {
            test: /\.less$/i,
            use: getStyleLoaders('less'),
          },
          // 处理图片和字体
          // {
          //   test: /\.(png|jpg|gif|svg|woff2?|ttf)$/, // 匹配图片和字体
          //   use: {
          //     loader: 'url-loader',
          //     options: {
          //       limit: 8192, // 小于 8KB 的文件转为 base64
          //       name: 'assets/[name].[hash:8].[ext]' // 大于 8KB 的文件输出路径
          //     }
          //   },
          // },
          // 图片配置
          {
            test: /\.(png|jpg|gif|svg)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: { maxSize: 8 * 1024 } // 图片小文件转base64
            },
            generator: {
              filename: 'imgs/[contenthash][ext]'
            },
            // use: 'image-webpack-loader' // 对图片压缩
          },
          // 字体配置
          {
            test: /\.(woff2?|ttf|eot)$/,
            type: 'asset/resource',
            generator: {
              filename: 'fonts/[name][ext]' // 字体使用原名，便于引用
            }
          }
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      minify: { // 压缩 HTML
        collapseWhitespace: true, // 移除空格
        removeComments: true // 移除注释
      },
      title: '时雨博客' // 网页标题
    }),
    new VueLoaderPlugin(),  // 解析 .vue 文件必需
    new ESlintPlugin({  // 代码检查
      context: path.resolve(__dirname, '../src'),
      extensions: ['js', 'vue'],
      exclude: 'node_modules',
      cache: true, // 开启缓存
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslintcache'), // 缓存目录
      // threads: true // 开启多线程
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash:8].css', // 输出 CSS 文件到 styles 目录
    }),
    new DefinePlugin({  //定义全局变量和环境变量
      // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      BASE_URL: JSON.stringify('/'), // 自定义全局变量
      __VUE_OPTIONS_API__: JSON.stringify(false),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all', // 对所有类型的块进行代码分割
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          priority: -10,
          minChunks: 2, // 被引用至少 2 次才拆分
          reuseExistingChunk: true,// 复用已拆分的代码块
        },
      },
    },
  },
};

