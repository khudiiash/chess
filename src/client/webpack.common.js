const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCss = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');
const isDevelopment = process.env.NODE_ENV === 'development'
const PATHS = {
  root: path.join(__dirname, '..'),
  client: path.join(__dirname)
}

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devtool: 'source-map',
  devtool: 'inline-source-map',
  output:{
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      // TS
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: [PATHS.root, PATHS.client],
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

      // Local audio files
      {
        test: /\.(mp3|wav|ogg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'audio',
              publicPath: 'audio'
            }
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
      'static': path.resolve(__dirname, 'static'),
      'root': PATHS.root
    },
    extensions: ['.ts', '.js', '.scss'],
    fallback: {
      "buffer": false,
      util: require.resolve("util/")
    }
  }, 
  plugins:
  [
    new Dotenv({
      systemvars: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
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
       filename: isDevelopment ? '[name].css' : '[name].[fullhash].css',
       chunkFilename: isDevelopment ? '[id].css' : '[id].[fullhash].css'
     })
  ]
};