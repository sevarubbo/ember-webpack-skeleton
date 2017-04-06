const
    path = require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    UglifyJsPlugin = require("webpack-uglify-js-plugin"),
    extractSCSS = new ExtractTextPlugin("styles.css");

module.exports = {
    entry: "./app/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    externals: {
        "jquery": "jQuery",
        "ember": "Ember",
        "ember-data": "DS"
    },
    resolve: {
        modules: [path.resolve(__dirname, "app"), "node_modules"],
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: "pre",
                loader: "jshint-loader"
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015"]
                }
            },
            {
                test: /\.hbs$/,
                loader: "./webpack-loaders/ember-template-loader"
            },
            {
                test: /app\/index\.js$/,
                loader: "./webpack-loaders/inject-templates-loader!./webpack-loaders/module-loader"
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                enforce: "pre",
                loader: "file-loader?name=images/[hash].[ext]"
            },
            {
                test: /app\/styles\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: "css-loader?minimize!resolve-url-loader!sass-loader?sourceMap!./webpack-loaders/inject-styles-loader"
                })
            }
        ]
    },
    plugins: [
        extractSCSS,
        new UglifyJsPlugin({
            cacheFolder: path.resolve(__dirname, "dist"),
        })
    ],
    watch: true
};
