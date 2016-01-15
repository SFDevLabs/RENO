const webpack = require('webpack');
const env = process.env.NODE_ENV

module.exports = {
    entry: env==='development'?[
        'webpack-dev-server/client?http://0.0.0.0:8090', // WebpackDevServer host and port
        'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
        './app/js/app.js' // Your appʼs entry point
    ]:'./app/js/app.js',
    output: {
        filename: 'bundle.js',
        publicPath: '/app/js/',
        path: 'build/js/'
    },
    module: {
        loaders: [
           { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    },
    devtool: env==='development'?'source-map':null,
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
}