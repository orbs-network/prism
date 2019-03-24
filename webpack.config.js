/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const cssnano = require('cssnano');

const config = require('./src/server/config');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

const plugins = [
  new HtmlWebpackPlugin({
    title: 'Prism',
    favicon: './src/client/favicon.ico',
    filename: 'index.html',
    template: './src/client/index.ejs',
  }),
];

if (!config.IS_PRODUCTION) {
  plugins.push(new OpenBrowserPlugin({ url: `http://localhost:${config.SERVER_PORT}` }));
}

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// plugins.push(new BundleAnalyzerPlugin());

module.exports = {
  mode: config.IS_PRODUCTION ? 'production' : 'development',
  devtool: config.IS_PRODUCTION ? '' : 'inline-source-map',
  entry: ['./src/client/client'],
  output: {
    path: path.join(__dirname, 'dist', 'public'),
    filename: `[name]-[hash:8]-bundle.js`,
    publicPath: '/public/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: ['babel-loader'],
        exclude: [/node_modules/, nodeModulesPath],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              sourceMap: !config.IS_PRODUCTION,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !config.IS_PRODUCTION,
              plugins: config.IS_PRODUCTION ? [] : [cssnano()],
            },
          },
        ],
      },
      {
        test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
        use: 'url-loader?limit=10000',
      },
    ],
  },
  plugins,
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
