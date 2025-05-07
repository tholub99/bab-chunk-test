import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

// App directory
const appDirectory = path.dirname(fileURLToPath(import.meta.url));
 
export default merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: resolve(appDirectory, "public"),
        compress: true,
        webSocketServer: false
    },
});