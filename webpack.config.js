const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: ['./src/risland.ts']
    , output: {
        filename: 'risland.min.js',
        libraryTarget: 'var',
        library: 'RIsland',
        libraryExport: 'default'
    }
    , resolve: {
        modules: ['node_modules']
        , extensions: ['.ts', '.js']
    }
    , module: {
        rules: [{
            test: /\.ts$/
            , loader: 'ts-loader'
            , exclude: /node_modules|\.(?:mock|spec)\.ts$/
        }]
    }
    , optimization: {
        minimize: true
        , minimizer: [
            new TerserPlugin({
                terserOptions: {
                    // we preserve class names, so they do not get mangled, because some systems rely on the class name
                    // see https://stackoverflow.com/a/56723206/5794504
                    keep_classnames: true
                    , keep_fnames: true
                }
                , extractComments: false
            })
        ]
    }
    , mode: 'production'
    , stats: 'normal'
	// see https://github.com/webpack/webpack/issues/3486
	, performance: {
		hints: false
    }
};
