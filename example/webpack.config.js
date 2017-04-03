const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

var config = {
  resolve: { extensions: [ '.js', '.jsx', '.ts', '.tsx', '.json' ] },
  output: {
        filename: "[name].bundle.js",
        path: __dirname + "/dist"
  },
  devtool: "source-map",
  module: {
      rules: [
          { test: /\.tsx?$/, loader: "ts-loader" },
          { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ],
  }
};


var clientConfig = merge(config,{
  resolve: { extensions: [ '.js', '.jsx', '.ts', '.tsx', '.json' ] },
  entry: {
    App: './src/App'
  },
  plugins: [      
      new HtmlWebpackPlugin({  // Also generate a test.html 
            filename: 'index.html',
            template: 'assets/index.html',
            chunks: ['App']
     })]  
});

var serverConfig = merge(config,{
  resolve: { extensions: [ '.js', '.jsx', '.ts', '.tsx', '.json' ] },
  entry: {
    Server: './src/Server'
  },
  target: "node"
});

module.exports = [ serverConfig, clientConfig ];