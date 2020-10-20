const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
  mode,
  entry: {
    bundle: ['./src/main.js'],
    compiler: ['./src/repl/compiler.js'],
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true,
            preprocess: require('./svelte.config').preprocess,
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.ttf$/,
        use: ['file-loader'],
      },
    ],
  },
  devtool: prod ? false : 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: 'site/*', flatten: true }],
    }),
    new MonacoWebpackPlugin({
      languages: ['html', 'css', 'typescript', 'javascript'],
    }),
    new MiniCSSExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
