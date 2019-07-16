const responsive = () => {

    const basePage = {
        width: 1000,
        m_width: 600,
        height: 750,
        m_height: 450,
        scale: 1,
        scaleX: 1,
        scaleY: 1
    };


    const page = $('#game_view');
    const body = $('body');

    scalePages(page,window.innerWidth, window.innerHeight);
    $(window).resize(() => scalePages(page, window.innerWidth,  window.innerHeight));


    function scalePages(page, maxWidth, maxHeight) {
        let scaleX = 1, scaleY = 1;

        if (maxWidth > maxHeight){
            // landscape
            scaleX = maxWidth / basePage.width;
            scaleY = maxHeight / basePage.height;
            basePage.scaleX = scaleX;
            basePage.scaleY = scaleY;

            basePage.scale = (scaleX > scaleY) ? scaleY : scaleX;
        }
        else if (maxWidth <= maxHeight){
            // portrait
            scaleX = maxWidth / basePage.m_width;
            scaleY = maxHeight / basePage.m_height;
            basePage.scaleX = scaleX;
            basePage.scaleY = scaleY;
            basePage.scale = scaleX;
        }

        let width = Math.abs(Math.ceil(maxWidth / basePage.scale));
        let height = Math.abs(Math.ceil(maxHeight / basePage.scale));
        if (basePage.scale >= 1){
            basePage.scale = 1;
            width = maxWidth;
            height = maxHeight;
        }
        page.attr('style', `-webkit-transform:scale(${basePage.scale}); width:${width}px; height:${height}px;`);
    }
};

function toggleFullScreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
}


function preventDefault(e) {
    if (e.preventDefault)
        e.preventDefault();

}

function disable_scroll_mobile() {
    document.addEventListener('touchmove', preventDefault, false);
}

export default () => {
    disable_scroll_mobile();
    window.scrollTo(0, 0);
    responsive();
    window.scrollTo(0, 0);
    document.ondblclick = toggleFullScreen;
}
