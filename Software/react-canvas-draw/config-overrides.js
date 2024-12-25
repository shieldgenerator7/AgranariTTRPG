//2024-12-21: copied from https://stackoverflow.com/a/70485253/2336212
module.exports = function override (config, env) {
    console.log('override')
    let loaders = config.resolve
    loaders.fallback = {
        "fs": false,
        "tls": false,
        "net": false,
        "http": require.resolve("stream-http"),
        "https": false,
        "zlib": require.resolve("browserify-zlib") ,
        "path": require.resolve("path-browserify"),
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
        "crypto": require.resolve("crypto-browserify"),
        "buffer": require.resolve("buffer/"),
        "querystring": require.resolve("querystring-es3"),
        "assert": require.resolve("assert/"),
        "url": require.resolve("url/"),
        "timers": require.resolve("timers-browserify"),
    }
    
    // //2024-12-21: copied from https://stackoverflow.com/questions/30239060/uncaught-referenceerror-process-is-not-defined
    // const webpack = require('webpack');
    // const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
    // const isDevelopment = process.env.NODE_ENV !== 'production';
    // config.plugins.push(
    //     new webpack.DefinePlugin({
    //         'process.env': JSON.stringify(dotenv.parsed),
    //         'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production'),
    //     })
    // );

    //2024-12-21: copied from https://stackoverflow.com/a/71205013/2336212
    const webpack = require('webpack');
    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    ];
    
    return config
}