
chat = function(e , chat , location){
    chat = chat.replace("<"," ");
    e.teamSend('chat', { location , message: chat} , true)
};

module.exports= chat;