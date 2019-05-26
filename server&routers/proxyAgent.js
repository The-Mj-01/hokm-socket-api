let glVar=require('../glob_var');

function run() {
    if (glVar.app.use_proxy) {
        const HttpsProxyAgent = require('https-proxy-agent');
        return new HttpsProxyAgent(glVar.app.proxy);
    }
    else return null
}
exports.run=run;
