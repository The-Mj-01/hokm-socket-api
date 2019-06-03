const openFile = require('../openFile');
const jsdom = require('jsdom').JSDOM;


nw=function(htmlC){
    let rnd={};
   let dom = new jsdom(htmlC);
    let window = dom.window;
    let $ = require('jquery')(window);
     rnd.window=window;
     rnd.$=$;
    return rnd
};

render=function(req_data,rnd){
    openFile.servPage(req_data,withHtml(rnd.window.document.documentElement.innerHTML));

};

getHtml=function(rnd){
    return(withHtml(rnd.window.document.documentElement.innerHTML));
};
function withHtml(html){
    return '<!DOCTYPE html>\n<html>'+html+'</html>'
}

module.exports.getHtml=getHtml;
module.exports.nw=nw;
module.exports.render=render;
