// vue.config.js
var path = require("path")
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

const webpack = require('webpack')
const routes = ["index", "table", "form"]

function createPagesEntries() {
    var _a = {}
    routes.map(key => {
        _a[key] = {
            entry: `src/views/${key}/main.js`,
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: `${key}.html`,
            title: `${key} Page`,
        }
    })
    return _a
}
function createPagesHtmlPluginConfig(config) {
    routes.map(key => {
        config.plugin(`html-${key}`).tap(args => {
            // console.log(`${key}-index`,args)
            args.map(item => {
                item.alwaysWriteToDisk = true
                item.minify = {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: false
                }
                return item
            })
            return args
        })
    })
    return config
}


module.exports = {
    publicPath: '/index/',
    pages: createPagesEntries(),
    productionSourceMap: process.env.NODE_ENV == 'development' ? true : false, //不生成 map
    // productionSourceMap: true,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            // change xxx-api/login => mock/login
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            [process.env.VUE_APP_BASE_API]: {
                target: `http://127.0.0.1:${port}/mock`,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        },
    },

    chainWebpack: config => {
        createPagesHtmlPluginConfig(config)
        //配置 alias
        config.resolve.alias.set("~", path.resolve(__dirname, './public'));
        //处理 前端资源的image 都转base64  file-loader
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 10240 }));

        // html plugin
        // config.plugin('html')
        //     .tap(args => {
        //         args[0].minify = {
        //             removeAttributeQuotes: false // 移除属性的引号
        //         };
        //         return args
        //     });
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
    },
    configureWebpack: {
        plugins: [

        ]
    },
};
