
chat = function(e , chat , location){
    chat = chat.replace("<"," ");
    e.teamEmit('chat', { location , message: chat} , true)
};

module.exports= chat;