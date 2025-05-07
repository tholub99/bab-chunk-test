import path, { resolve as _resolve } from "path";
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// App directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default env => {
    var external_values = [
        {
            oimo: true,
            earcut: true,
            cannon: true,
        },
    ];

    // If --env=BABYLON=true is not found then ignore packing babylon
    if (env.BABYLON === undefined) {
        external_values.push(/^@babylonjs.*$/);
    }

    return {
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
    externals: external_values,
    performance: {
        maxEntrypointSize: 2000000,
        maxAssetSize: 2000000,
    },
    output: {
        path: path.resolve(__dirname, 'dist/lib/esm'),
        filename: 'chunk-test.bundle.js',
        chunkFilename: '[name].[contenthash].js',
        library: {
            type: 'module',
        },
        clean: true,
    },
    experiments: {
        outputModule: true,
    },
    devtool: 'source-map',
    devServer: {
        static: {
            directory: './samples',
        },
        devMiddleware: {
            publicPath: '/dist/',
        },
        open: true,
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                webgpuShaders: {
                    name: "webgpu-shaders",
                    chunks: "all",
                    priority: 50,
                    enforce: true,
                    test: (module) => /\/ShadersWGSL\//.test(module.resource),
                },
                webglShaders: {
                    name: "webgl-shaders",
                    chunks: "all",
                    priority: 50,
                    enforce: true,
                    test: (module) => /\/Shaders\//.test(module.resource),
                },
                webgpuExtensions: {
                    name: "webgpu-extensions",
                    chunks: "all",
                    priority: 50,
                    enforce: true,
                    test: (module) => /\/WebGPU\//.test(module.resource),
                },
                babylonBundle: {
                    name: "babylonBundle",
                    chunks: "all",
                    priority: 30,
                    reuseExistingChunk: true,
                    test: (module) => /\/node_modules\/@babylonjs\//.test(module.resource),
                },
            },
        },
        usedExports: true,
    },
}
}
