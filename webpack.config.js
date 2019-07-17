const path = require('path')
const nodeExternals = require('webpack-node-externals')
const WebpackShellPlugin = require('webpack-shell-plugin-next')

module.exports = (env, args) => {
    return {
        entry: './src/index.ts',
        target: 'node',
        watch: args.mode === 'development',
        externals: [nodeExternals()],
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'index.js'
        },
        plugins: [
            new WebpackShellPlugin({
                onBuildEnd: {
                    scripts: ['npm run run:dev'],
                    blocking: false,
                    parallel: true
                }
            })
        ],
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: ['ts-loader']
                }
            ]
        }
    }
}