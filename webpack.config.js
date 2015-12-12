module.exports = {
    entry: {
        app:'./app/js/app.js'
    },
    output: {
        filename: 'bundle.js',
        publicPath: '/js/',
        path: 'dist/js/'
    },
    module: {
        loaders: [
           { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    },
    devtool: 'source-map'
}