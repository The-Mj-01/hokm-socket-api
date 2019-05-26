const steamPort=15626;
const port = 80;

const express = require('express');
const bodyParser = require("body-parser");
const serverRouter= require("./serverRouter");
const http= require("http");
const serverResp= require("./serverResponse");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const S_io= require("./socket_io");
const io = require('socket.io')();
const app = express();
const HostServer = http.createServer(app);

io.connectX=function () {
    io.listen(steamPort,{'pingTimeout':4000, 'pingInterval':2000});
};
S_io.new(io);

app.use(bodyParser.json());  ///have bug
app.use(cookieParser());
app.use(session({secret:"1234" ,cookie: { maxAge: 60000 }}));
app.use('/files',express.static('./website/files'));

function start() {
    app.route('*')
        .get(function (req, res) {
            serverRouter.route(req, res);
        })
        .post(function (req, res){
            let post = req.body;
            if (post) {
                req.postData = post;
                serverRouter.route(req, res);
            }
            else  serverResp.writeErr(req_data, JSON.stringify({status: 'err', ERR: 'fucking problem with post data'}));

        })
    }


HostServer.listen(port,()=>{
    console.log('__SERVER RUN__');
});


exports.start = start;