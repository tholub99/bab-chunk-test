import path, { resolve as _resolve } from "path";
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
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
                babylonCore: {
                    name: "babylonCore",
                    chunks: "all",
                    priority: 40,
                    reuseExistingChunk: true,
                    test: (module) => /\/node_modules\/@babylonjs\/core/.test(module.resource),
                },
                babylonDependencies: {
                    name: "babylonDependencies",
                    chunks: "all",
                    priority: 30,
                    enforce: true,
                    test: (module) => /\/node_modules\/@babylonjs\//.test(module.resource),
                },
            },
        },
        usedExports: true,
    },
}
