console.clear();
process.setUncaughtExceptionCaptureCallback=(e)=>{
   console.log("processERR");
   console.log(e);
}
const readline = require('readline');
const express =require('./server&routers/express');
const c =require('./gameServer/game/shuffleDeck');
const db =require('./gameServer/database');



//console.log(hokm);
db.newDB();
express.start();
