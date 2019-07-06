
chat = function(e , chat , location){
    chat = chat.replace("<"," ");
    e.teamEmit('chat', { location , message: chat})
};

module.exports= chat;