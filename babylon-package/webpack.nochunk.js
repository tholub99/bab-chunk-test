import webpack from "webpack";
import common from './webpack.common.js';
import { merge } from 'webpack-merge';

export default merge(common, {
    mode: 'production',
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
    ],
});
