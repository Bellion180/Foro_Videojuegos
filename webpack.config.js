// Custom webpack configuration to inject environment variables into index.html
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      '%ENVIRONMENT_IS_DEV%': process.env.NODE_ENV !== 'production',
    }),
    // Handle html-webpack-plugin to ensure it works with our custom modification
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
      scriptLoading: 'blocking'
    })
  ]
};
