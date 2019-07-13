let initial_scale=0.75;



function setViewPort($) {
    let width = window.innerWidth;
    if (width < 300 && width > 1) initial_scale = "0.55";
    if (width < 400 && width > 299) initial_scale = "0.65";
    if (width < 500 && width > 399) initial_scale = "0.75";
    if (width < 1000 && width > 500) initial_scale = "1";
    if (width >= 1000) initial_scale = "1";
    let screen_w = "device-width";
    $('meta[name = "viewport"]').attr("content", `user-scalable=no, initial-scale=${initial_scale}, , width=${screen_w}`)
}
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

////////disable scrooling on mobile


function preventDefault(e) {
    if (e.preventDefault)
        e.preventDefault();

}

// MOBILE
function disable_scroll_mobile(){
    document.addEventListener('touchmove',preventDefault, false);
}

export default () => {
    disable_scroll_mobile();
    window.scrollTo(0, 0);
    setViewPort($);
    window.scrollTo(0, 0);
    document.ondblclick = toggleFullScreen;
}
