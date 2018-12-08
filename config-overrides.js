const { injectBabelPlugin } = require('react-app-rewired');
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = function override(config, env) {
    // do stuff with the webpack config...
    config = injectBabelPlugin(['@babel/plugin-proposal-decorators', { "legacy": true }], config)   //{ "legacy": true }一定不能掉，否则报错

    config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }], config,);  //antd按需加载

    config.resolve.alias = {
        '@': resolve('src')         //配置别名
    }

    return config;
};