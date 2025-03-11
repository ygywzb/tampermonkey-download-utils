const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'my-tools.js',
        library: 'MyTools',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
            }
        ]
    }
};