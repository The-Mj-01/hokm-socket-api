//import $ from './jquery-2.0.3.min'
let frag = document.createDocumentFragment();

const arrow = document.createElement('div'),
    button = document.createElement('button'),
    message = document.createElement('div'),
    moveMessage = document.createElement('div'),
    endMessage = document.createElement("div");


button.id = 'play-button';
message.id = 'game-message';
arrow.innerHTML = "&larr;";
arrow.id = 'pass-arrow';
endMessage.id = "end-message";
moveMessage.className = 'msgMove';
frag.appendChild(arrow);
frag.appendChild(button);
frag.appendChild(message);
frag.appendChild(endMessage);
frag.appendChild(moveMessage);

function moveMess() {
    const jdim = $(".msgMove");
    jdim.removeClass('anim');
    void moveMessage.offsetWidth;
    jdim.addClass('anim');
}

export default {
    fragmentToDom: function (dom) {
        dom.appendChild(frag);
        frag = null;

    },
    clearEvents: function () {
        $(button).off("click");
        $(arrow).off("click");
    },
    showArrow: function () {
        arrow.classList.add('show');
    },
    hideArrow: function () {
        arrow.classList.remove('show');
    },
    showButton: function (text) {
        button.innerHTML = text;
        button.classList.add('show');
    },
    hideButton: function (text) {
        button.classList.remove('show');
    },
    arrowClickOnce: function (cb) {
        $(arrow).on("click", function () {
            cb();
            $(this).off("click");
        });
    },
    buttonClickOnce: function (cb) {
        $(button).on("click", function () {
            cb();
            $(this).off("click");
        });
    },
    showWin: function (won) {
        endMessage.innerHTML = won ? "YOU WON!" : "YOU LOST!";
        endMessage.classList.add("show");
    },
    hideWin: function () {
        endMessage.classList.remove("show");
    },
    showMessage: function (msg) {
        message.innerHTML = msg;
        message.style.display = 'block';
    },
    showMoveMess: function (msg) {
        moveMessage.innerHTML = msg;
        moveMess();
    },
    showPassingScreen: function (dir) {
        var directions = ['left', 'right', 'opposite'];
        this.showMessage("Pass three cards to the " + directions[dir]);
        [function () {
            $(arrow).css("transform", 'rotate(0)');
        }, function () {
            $(arrow).css("transform", 'rotate(180deg)');
        }, function () {
            $(arrow).css("transform", 'rotate(90deg)');
        }][dir]();
    },
    hideMessage: function () {
        message.style.display = '';
    },
};

