const fs = require('fs');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const babelrc = JSON.parse(
  fs.readFileSync(process.cwd() + '/.babelrc', 'utf8')
);
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: {
    main: './main.js'
  },
  output: {
    globalObject: 'this', // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的情况
    // libraryTarget: 'umd',
    publicPath: 'auto'
  },
  resolve: {
    alias: {
      controls: path.resolve(__dirname, 'controls'),
      common: path.resolve(__dirname, 'common'),
      '@': './'
    }
  },
  devServer: {
    host: '127.0.0.1',
    disableHostCheck: true
  },
  experiments: {
    topLevelAwait: true // 试验性质顶级作用域允许await
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      // 图片、字体、发布
      {
        test: /\.(gif|jpeg|jpg|png|woff|woff2|svg|eot|ttf)(\?.*?)?$/,
        type: 'asset',
        generator: {
          filename: './[name].[hash:5].[ext]'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelrc
        }
      }
    ]
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  plugins: [
    new ModuleFederationPlugin({
      // 唯一ID，用于标记当前服务
      name: 'h5_federation',
      // 提供给其他服务加载的文件,也就是打包出来的入口文件名
      filename: 'federation.js',
      library: { type: 'var', name: 'h5_federation' },
      // 需要暴露的模块，使用时通过 `${name}/${expose}` 引入
      exposes: {
        './Federation': './instance.js'
      },
      shared: ['react', 'react-dom']
    }),
    new HtmlWebPackPlugin({
      template: './index.html',
      filename: './index.html'
    })
  ]
};
