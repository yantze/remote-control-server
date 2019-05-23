const path = require('path')

// const webpack = require('webpack')
const IgnoreAssetsPlugin = require('ignore-assets-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const HtmlWebpackPlugin = require('html-webpack-plugin')

// const devMode = process.env.NODE_ENV !== 'production'

module.exports = [
    {
        entry: {
            default: './src/themes/default.scss',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'themes/_unused_[name].js',
        },
        optimization: {
            minimizer: [
                new TerserJSPlugin({}),
                new OptimizeCSSAssetsPlugin({}),
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'themes/[name].css',
                // chunkFilename: '[id].css',
            }),
            new IgnoreAssetsPlugin({
                ignore: ['themes/_unused_default.js'],
            }),
            new HtmlWebpackPlugin({
                inject: false,
                hash: true,
                template: './demo.html',
                filename: 'demo.html',
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                // you can specify a publicPath here
                                // by default it uses publicPath in webpackOptions.output
                                // publicPath: '../',
                                hmr: process.env.NODE_ENV === 'development',
                            },
                        },
                        {
                            // Interprets `@import` and `url()` like `import/require()` and will resolve them
                            loader: 'css-loader',
                        },
                        {
                            // Loader for webpack to process CSS with PostCSS
                            loader: 'postcss-loader',
                            options: {
                                plugins: function() {
                                    return [require('autoprefixer')]
                                },
                            },
                        },
                        {
                            // Loads a SASS/SCSS file and compiles it to CSS
                            loader: 'sass-loader',
                        },
                    ],
                },
            ],
        },
    },
    {
        entry: ['./bootstrap.js'],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bootstrap.js',
        },
    },
]
