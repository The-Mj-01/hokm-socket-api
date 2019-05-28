console.clear();
process.setUncaughtExceptionCaptureCallback=(e)=>{
   console.log("processERR");
   console.log(e);
}
const express =require('./server&routers/express');
const db =require('./gameServer/database');

db.newDB();
express.start();
