const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const url = window.location.href;
const isInTelegram = !url.includes('m=false');
const isGlobal = url.includes('GlobalHokm');
console.log(isMobile,isInTelegram,isGlobal)
window.isNotTg=false

if (isMobile && isInTelegram && isGlobal){
    showMessage();
}

else window.isNotTg=true;

function showMessage(){
    let alertE = document.createElement("div");
    let close = document.createElement("button");
    alertE.classList="tgShowMess";
    close.onclick=function(){
    	window.location=url+"&m=false"
    }
    close.classList="closeBTN"
    close.innerHTML="بستن"
    alertE.appendChild(close)
    document.body.appendChild(alertE);
    window.history.pushState('ALERT', '', url+"&m=false");                                                                        



}
