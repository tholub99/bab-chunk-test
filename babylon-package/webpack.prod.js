import TerserPlugin from 'terser-webpack-plugin';

export default {
    mode: 'production',
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
};