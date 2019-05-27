'use strict'
let room;
let ns={};
ns["/hokm"]="hokm";
ns["/GlobalHokm"]="globalHokm";
let nameSpace;
var socket=null;
let socket_ID=null;
let serverPort=15626;
let setIntervalTime=8000;
let lastCOM;
let evenDisconnected=false;
let pingTimeStart=null;
let pinginterval=null;
let pingResp=true;


define(["socket_io","jquery","loadingPage","loginPage","./ui","./socket/game_core","config"],
    function(socket_io,$,   loadingPage,  loginPage,    ui      , game_core,config){
        let pingTimeDom = $("#pingTime");
        let globalGame={
            id:null,
            userName:null,
            getMyData: function (CB) {
                $.post(document.location.pathname+"/getS",{},(data)=>{
                    if(data.ok){
                        this.id=data.result.id  ;
                        this.userName=data.result.userName;
                        CB(data);
                    }

                })
            }
        };
        const loginRoom={
            hokm:function () {
                room=document.location.search.replace('?game=','');
                config.setRoom_id(room);
                socket.emit('loginRoom',{socket_ID,room})
            },
            globalHokm:function () {

                socket.emit('singUpGlobalRoom',{id:globalGame.id,userName:globalGame.userName});
                loginPgae({loginData:false})
            }
        };
        const connectTOS=function (CB) {
         
           socket=socketConnect();

            window.socket=socket;

            socket.on("connect",onConnect);
            socket.on("disconnect",(r)=>{
                $("#pingTime").html("Disconnected !");
                evenDisconnected=true;
                console.log("socket disconnect",r);
            });
            socket.on('checkOK',(res)=>{
                if(res){
                    loadingPage.load(false);
                    loginPgae();
                }

            });
            socket.on('GAME',(mess)=>{
                if(mess){
                    lastCOM = mess;
                    game_core(mess);
                }

            });
            socket.on('connect_error', (error) => {console.log('connect_error',error)});
            socket.on('error', (error) => {console.log('error',error)});
            socket.on('connect_timeout', (error) => {console.log('connect_timeout',error)});
            socket.on('reconnect', (x) => {console.log('reconnect',x)});
            socket.on('reconnecting', (x) => {console.log('reconnecting',x)});
            socket.on('reconnect_error', (x) => {console.log('reconnect_error',x)});
            socket.on('reconnect_failed', (x) => {console.log('reconnect_failed',x)});
            socket.on('setSocketID', (id) => {socket_ID=id});
            socket.on('room_id',(room_id)=>{room=room_id});
            socket.on('pongT', () => {
                pingResp=true;
                let newTime = new Date().getTime();
                let pingTime= newTime - pingTimeStart;
                updatePingDom(pingTime+" ms");
            });
            socket.on('errBOX',(res)=>{
                ui.showMessage(res);
                loadingPage.load(false);
            });
        };
        getNameSpace();
        function getNameSpace() {
            nameSpace=ns[document.location.pathname];
            if (nameSpace==="hokm"){
                room=document.location.search.replace('?game=','');
                if(!room){
                    loadingPage.load(false);
                    ui.showMessage("شماره بازی وجود ندارد.");
                    socket.disconnect();
                    return
                }
                connectTOS()
            }
            else if (nameSpace ==="globalHokm")globalGame.getMyData(()=>{
                config.setMyName(globalGame.userName);
                connectTOS();

            })
        }
        function loginPgae(data) {
            loginPage(data);
        }

        function onConnect() {
            console.log("socket Connect");
            $("#pingTime").html("Connected");
            if (evenDisconnected && room) {
                socket.emit('returnRoom',{room , lastCOM});
            }
            else loginRoom[nameSpace]();
            loadingPage.errBoxRemove();
            if (pinginterval) clearInterval(pinginterval);
             pinginterval = setInterval(ping,setIntervalTime);

        }
        function socketConnect() {
            let pageURL=document.location;
            socket = socket_io.connect(pageURL.host+`:${serverPort}/${nameSpace}`, {
                reconnection: true,
                reconnectionDelay: 200,
                reconnectionDelayMax : 1000,
                //reconnectionAttempts: Infinity,
                upgrade: true
            });
            socket.heartbeatTimeout = 20000;
            return socket
        }
        function ping(){
            if (!pingResp)updatePingDom("Time Out!!");
            pingResp=false;
            pingTimeStart = new Date().getTime();
            socket.emit('pingT',true);
        }
        function updatePingDom(ping){
            pingTimeDom.html(ping);
        }



        //return methods;

    });