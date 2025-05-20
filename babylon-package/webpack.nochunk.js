import path, { resolve as _resolve } from "path";
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { fileURLToPath } from 'url';
import webpack from "webpack";
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// App directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.esm.json',
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'esbuild-loader',
                options: {
                    target: 'ES2022',
                },
            },
            {
                test: /\.(gif|svg|jpe?g|png|eot|woff|woff2|ttf)$/,
                type: 'asset/inline',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    performance: {
        maxEntrypointSize: 2000000,
        maxAssetSize: 2000000,
    },
    output: {
        path: path.resolve(__dirname, 'dist/lib/esm/js'),
        filename: 'chunks.bundle.js',
        chunkFilename: '[name].[contenthash].js',
        library: {
            type: 'module',
        },
        clean: true,
    },
    experiments: {
        outputModule: true,
    },
    devServer: {
        static: {
            directory: './samples',
        },
        devMiddleware: {
            publicPath: '/dist/',
        },
        open: true,
    },
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    compress: {
                        pure_funcs: ['console.assert', 'console.debug', 'console.error', 'console.warn'],
                    },
                },
            }),
        ],
    },
}
