const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');


module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  output:{
      filename: 'bundle.[contenthash].js',
      path: path.resolve(__dirname, './dist')
  },
  devtool: 'source-map',
  plugins:
  [
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, './static'),
          noErrorOnMissing: true,
        }
      ]
    }),
  ],
  devtool: 'inline-source-map',
  module: {
    rules: [
      // TS
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
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
    extensions: ['.ts', '.js'],
    fallback: {
      "buffer": false
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    })
  ]
};