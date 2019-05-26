const jq_prs=require('./jq_processor');


let callback={};

Cb=function(type,mess,callback){
    let cbobj={};
    cbobj['status']=type;
    cbobj['data']=mess;
    callback(cbobj);

};
each=function(referenceOBJ,doFunc,callback) {
    let obj=referenceOBJ.obj;
    let rnd=referenceOBJ.rnd;
    let cont=referenceOBJ.container_id;
    let repeat=referenceOBJ.repeat_id;
    if (typeof obj==='object' && typeof rnd==='object'){
        if(typeof cont==='string' && typeof repeat==='string'){
            let squareHtml=rnd.$(repeat).wrap('<div/>').parent().html();
            let square_rnd = jq_prs.nw(squareHtml);
            rnd.$(".square").remove();
            let i=0;
            obj.forEach(function () {
                doFunc(square_rnd.$,i);
                let squareRender=jq_prs.getHtml(square_rnd);
                if(referenceOBJ.z_to_a){
                    rnd.$(cont).append(squareRender);
                }
                else{
                    rnd.$(cont).prepend(squareRender);
                }
                i++
            });

            return rnd



        }
        else {
            Cb('err','cont_html or repeat_html are not string ',callback)
        }
    }
    else {
        Cb('err','referenceOBJ is not an object',callback)
    }
};
each_async=function(referenceOBJ,doFunc,callback) {
return new Promise(resolve => {
    let obj=referenceOBJ.obj;
    let rnd=referenceOBJ.rnd;
    let cont=referenceOBJ.container_id;
    let repeat=referenceOBJ.repeat_id;
    if (typeof obj==='object' && typeof rnd==='object'){
        if(typeof cont==='string' && typeof repeat==='string'){
            let squareHtml=rnd.$(repeat).wrap('<div/>').parent().html();
            let square_rnd = jq_prs.nw(squareHtml);
            rnd.$(repeat).remove();
            let i=0;
             async function each() {

                await doFunc(square_rnd.$,i);

                let squareRender=jq_prs.getHtml(square_rnd);
                if(referenceOBJ.z_to_a){
                    rnd.$(cont).append(squareRender);
                }
                else{
                    rnd.$(cont).prepend(squareRender);
                }


                 i++;

                if (i >= obj.length)resolve();
                else each()

            }
            each();
            //console.log('CB');
           // callback();

        }
    }
});


};

callback.render_w_d=function(req_data,rnd,dash_rnd){

    let newHeadContent = rnd.window.document.head.innerHTML;
    let newBodyContent = rnd.window.document.body.innerHTML;
    dash_rnd.$('head').append(newHeadContent);
    dash_rnd.$('#second_page').html(newBodyContent);
    jq_prs.render(req_data,dash_rnd);
};

module.exports.each=each;
module.exports.each_async=each_async;

module.exports.callback=callback;
