
chat = function(e , inp){
    console.log(inp)
    let { location , message , sender} = inp
    message = message.replace("<"," ");
    e.teamEmit('chat', { location , message , sender})
}

module.exports= chat;