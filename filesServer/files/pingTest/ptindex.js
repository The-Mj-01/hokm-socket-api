let serverPort=100;
let socket=null;
let pingResp=false;
let pingTimeStart=null;
let body;let logDiv;
require({
        baseUrl: '../files/js',
        paths: {
            socket_io:'lib/socket_io',
        }
    },
    ["socket_io"],
    function(socket_io){
        clsButton();

        socket=socketConnect(socket_io);

        socket.on("connect",()=>{
            onConnect(socket);
        });
        socket.on('error', (error) => {console.log('error',error)});
        socket.on('pongT', () => {
            pingResp=true;
            let newTime = new Date().getTime();
            let pingTime= newTime - pingTimeStart;
            updatePingDom(pingTime+" ms");
            setTimeout(ping,3000);
        });

    });

function socketConnect(socket_io) {
    let pageURL=document.location;
    let nameSpace="pingTest";
    socket = socket_io.connect(pageURL.host+`:${serverPort}/${nameSpace}`, {
       // reconnection: true,
       // reconnectionDelay: 200,
       // reconnectionDelayMax : 5000,
       // reconnectionAttempts: Infinity,
        upgrade: true
    });
    //socket.heartbeatTimeout = 20000;
    window.socket=socket;
    return socket
}
function clsButton() {
    let b=document.createElement("button");
     logDiv=document.createElement("div");
    b.className="clsButton";
    b.innerHTML="clear Log";
    b.onclick=function(){
        logDiv.innerHTML=''
    };
    document.body.appendChild(b);
    document.body.appendChild(logDiv)
}
function onConnect() {
    ping()
}
function ping(){
    updatePingDom("pingRequest");
    pingResp=false;
    pingTimeStart = new Date().getTime();
    socket.emit('pingT');
    setTimeout(()=>{
        if (!pingResp)updatePingDom("Time Out!!");
    },4000)
}
function updatePingDom(ping){

    let a= logDiv.innerHTML;
    if (pingResp)a=a.replace("<br>"+"pingRequest","");
    logDiv.innerHTML=(a+"<br>"+ping)
}