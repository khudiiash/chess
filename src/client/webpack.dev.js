const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const portFinderSync = require('portfinder-sync')

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        devServer:
        {
            host: 'local-ipv4',
            port: portFinderSync.getPort(8080),
            open: true,
            https: true,
            static: ['./static'],
            client: {
              logging: 'none',
              overlay: false
            },
        }
    }
)