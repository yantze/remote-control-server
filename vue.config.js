const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    productionSourceMap: false,
    outputDir: 'dist',
    pages: {
        index: {
            // entry for the page
            entry: 'client/main.ts',
            // the source template
            template: 'client/public/index.html',
            // output as dist/index.html
            filename: 'index.html',
            // when using title option,
            // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Index Page',
            // chunks to include on this page, by default includes
            // extracted common chunks and vendor chunks.
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
    },
    configureWebpack: {
        performance: {
            maxAssetSize: 500000,
        },
        plugins: [
            new CopyWebpackPlugin([{ from: 'client/public', to: '.' }])
        ],
    },
}
