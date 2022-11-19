const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCss = require('mini-css-extract-plugin');
const path = require('path');
const isDevelopment = process.env.NODE_ENV === 'development'


module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  output:{
      filename: 'bundle.[contenthash].js',
      path: path.resolve(__dirname, './dist')
  },
  devtool: 'source-map',

  devtool: 'inline-source-map',
  module: {
    rules: [
      // TS
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // SCSS
      {
        test:/\.(s*)css$/,
        use: [
          MiniCss.loader,
          'css-loader',
          'sass-loader',
        ]
      },
       // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use:
        [
          {
            loader: 'file-loader',
            options: { outputPath: 'assets/fonts/' }
          }
        ]
      },

      // Shaders
      {
        test: /\.glsl$/,
        use: [ 'raw-loader' ]
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.js', '.scss'],
    fallback: {
      "buffer": false
    }
  }, 
  plugins:
  [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, './static'),
          noErrorOnMissing: true,
        }
      ]
    }),
    new MiniCss({
       filename: isDevelopment ? '[name].css' : '[name].[hash].css',
       chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
     })
  ]
};