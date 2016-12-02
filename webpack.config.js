// Author: ✰ Konstantin Aleksandrov ✰ https://github.com/koalex

'use strict';

const isDevelopment             = process.env.NODE_ENV === 'development';
const webpack		            = require('webpack');
const join                      = require('path').join;

const HtmlWebpackPlugin         = require('html-webpack-plugin');
const ExtractTextPlugin         = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin     = require('favicons-webpack-plugin');
// const WriteFilePlugin           = require('write-file-webpack-plugin');
const CompressionPlugin         = require('compression-webpack-plugin');
const autoprefixer              = require('autoprefixer');

const projectRoot               = join(__dirname, './src');
const publicRoot                = join(__dirname, './dist');


module.exports = {
    context: projectRoot,
    entry: {
        index: './index'
    },

    output: {
        path: publicRoot,
        publicPath: '',//'/assets/',
        filename: isDevelopment ? '[name].js' : '[name].[hash:7].js'
        //library: '[name]',
        // chunkFilename: isDevelopment ? '[id].js' : '[id].[chunkhash].js'
    },

    watch: isDevelopment,
    watchOptions: {
        aggreagateTimeout: 100
    },

    devtool: isDevelopment ? 'cheap-inline-module-source-map' : 'source-map',


    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        alias: { },
        extensions: ['', '.tsx', '.ts','.js', '.less', '.styl', '.scss']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules'],
        moduleTemplates: ['*-loader', '*'],
        extensions: ['', '.css', '.js']
    },

    module: {

        preLoaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                },
                exclude: /(node_modules|bower_components)/
            }
        ],

        loaders: [
            {
                test: /\.css$/,
                loader: isDevelopment ? 'style!css!postcss' : ExtractTextPlugin.extract('style', 'css!postcss')
            },
            {
                test: /\.less?$/,
                loader: isDevelopment ? 'style!css!postcss!less' : ExtractTextPlugin.extract('style', 'css!postcss!less')
            },
            {
                test: /\.scss?$/,
                loader: isDevelopment ? 'style!css!postcss!sass' : ExtractTextPlugin.extract('style', 'css!postcss!sass')
            },
            {
                test: /\.styl$/,
                loader: isDevelopment ? 'style!css!postcss!stylus' : ExtractTextPlugin.extract('style', 'css!postcss!stylus')
            },
            {
                test: /\.(png|jpg|jpeg|svg|ttf|eot|woff|woff2)$/i,
                loaders: [
                    'url?name='+ (isDevelopment ? '[path][name]' : '[path][name].[hash:7]') + '.[ext]&limit=4096!image?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
                ]
            }
        ],
        noParse: [/jquery/]

    },

    postcss: function () {
        return [ autoprefixer({ browsers: ['> 5%'] }) ];
    },

    plugins: [
        // new webpack.HotModuleReplacementPlugin(), // not need if in CLI --hot
        new webpack.NoErrorsPlugin(),

        new FaviconsWebpackPlugin({
            logo: join(projectRoot, 'assets/img/logo.png'),
            prefix: 'favicons-[hash]/', // '[hash]'
            emitStats: true,
            inject: true,
            statsFilename: 'favicons.json',
            background: '#fff',
            title: 'Aditii | Shop',
            silhouette: false,
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: true,
                favicons: true,
                firefox: true,
                opengraph: true,
                twitter: true,
                yandex: true,
                windows: true
            }
        }),

        new ExtractTextPlugin(isDevelopment ? '[name].css' : '[name].[contenthash:7].css', { allChunks: true }),

        new HtmlWebpackPlugin({
            template: 'index.html', // Load a custom template (ejs by default see the FAQ for details)
            filename: 'index.html',
            inject: 'true', // Inject all assets into the given: true | 'head' | 'body' | false,
            // chunks: ['common', 'app'],
            title: 'Aditii | Shop' // in tpl => htmlWebpackPlugin.options.title
        })

    ],
    devServer: {
        outputPath: publicRoot,
        host: 'localhost',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        },
        port: 8080,
        hot: isDevelopment
    }

};

/*if (isDevelopment) {
    module.exports.plugins.push(
        new WriteFilePlugin({
            test: /favicons\.json$/,
            useHashIndex: true
        })
    );
}*/


if (!isDevelopment) {
    module.exports.plugins.push(
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$/,
            minRatio: 0.8
        })
    );
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            test: /\.js?$/,
            //exclude // ебаный баг заставляет писать костыли https://github.com/webpack/webpack/issues/1079
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}