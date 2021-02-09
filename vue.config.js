const path = require('path');
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? '' : './',
  // 输出文件目录
  outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'devdist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  /** vue3.0内置了webpack所有东西，
   * webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
   **/
  configureWebpack: (config) => {
    config.resolve = { // 配置解析别名
      extensions: ['.js', '.json', '.vue'],  // 自动添加文件名后缀
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@c': path.resolve(__dirname, './src/components')
      }
    }
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      scss: {
        prependData: `@import "./src/scss/main.scss";`
      },
    }
  },
  // webpack-dev-server 相关配置
  devServer: {
    open: true, // 编译完成是否打开网页
    port: 3030, // 访问端口
    proxy: {
      // 获取验证码接口
      [`^${process.env.VUE_APP_ADIMIN_URL}`]: {
        target: process.env.VUE_APP_ADIMIN_TARGET,
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_ADIMIN_URL}`]: ''
        }
      }
    }
  },
  /**
   * 第三方插件配置
   */
  pluginOptions: {}
}
