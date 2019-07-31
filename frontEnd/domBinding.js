const chats = ['سلام!', '❤️😍', 'چه دستی!', 'دمت گرم!', 'خیلی کارت درسته!', 'چرا؟', 'از من یاد بگیر', 'عالیییییی!', '👌👌', 'اینم دسته؟']
let suits = ['spade', 'heart', 'club', 'diamond'];
let cardTrans = {
    A: 1,
    2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10,
    J: 11, Q: 12, K: 13,
};


var frag;

var CardDisplay = function (dom) {
    this.dom = $(dom);
    this.dom.on("click", function () {
        ///click every card
        this.onClick && this.onClick();
    }.bind(this));
};
let getCardIconPos = function (numtext) {
    let num = cardTrans[numtext] - 1;
    let posY = Math.floor(num / 5);
    let posX = num % 5;
    return {
        x: posX * (-82),
        y: posY * (-107)
    }


};

CardDisplay.prototype.adjustPos = function (pos) {
    if (!pos.rotation) {
        pos.rotation = 0;
    }
    if (!pos.rotateY) {
        pos.rotateY = 0;
    }
    const zIndex = 10 + pos.z;
    this.dom.css({
        zIndex,
        transform: 'rotate(' + pos.rotation + 'deg) translate3d(' + pos.x + 'px, ' + pos.y + 'px, ' + pos.z + 'px) rotateY(' + pos.rotateY + 'deg)'
    });
    this.zIndex = zIndex;

};

CardDisplay.prototype.setSelectable = function (yes) {
    if (yes) {
        this.dom.addClass("movable");
        this.dom.css({
            zIndex: self.zIndex + 20
        });
    } else {
        this.dom.removeClass("movable")
    }
};

CardDisplay.prototype.grayScale = function (yes) {
    const self = this;
    if (yes) {
        this.dom.addClass("grayScale");
    } else {
        this.dom.removeClass("grayScale");
    }
};

CardDisplay.prototype.isSelectable = function () {
    return this.dom.is(".movable");
};


var PlayerDisplay = function (id, name, human) {

    this.id = id;
    this.display = document.createElement('div');
    this.display.className = 'info-board board-' + id;
    if (id === 0) this.display.className = 'info-board selfBoard board-' + id;
    this.nametext = document.createElement('div');
    this.nametext.className = 'player-name';
    this.nametext.innerHTML = name;


    this.hakemTag = document.createElement('div');
    this.hakemTag.className = 'hakemTag';

    this.chatbar = document.createElement('div');
    this.chatbar.className = 'chatbar';

    this.display.appendChild(this.nametext);
    this.display.appendChild(this.hakemTag);
    this.display.appendChild(this.chatbar);


    frag.appendChild(this.display);

    this.rank = null;
};

PlayerDisplay.prototype.setName = function (name) {
    this.nametext.innerHTML = name;
};
PlayerDisplay.prototype.setHakem = function (yes) {
    if (yes) {
        this.hakemTag.className += " true";
    } else this.hakemTag.className = "hakemTag";
};
PlayerDisplay.prototype.setTurn = function (val) {
    let display = $(this.display);
    val ? display.addClass("highlight") : display.removeClass("highlight");
};
PlayerDisplay.prototype.showChat = function (mess) {
    let chatbar = $(this.chatbar);
    chatbar.removeClass('anim');
    void this.chatbar.offsetWidth;
    chatbar.html(mess).addClass('anim');
};

PlayerDisplay.prototype.offline = function (mode) {
    const display = $(this.display);
    mode ? display.addClass('offline') : display.removeClass('offline')
};


PlayerDisplay.prototype.setHuman = function (yes) {
    if (yes) {
        this.display.className += " human";
    }
};

PlayerDisplay.prototype.setHighlight = function (yes) {
    if (yes) {
        $(this.display).addClass("highlight");
    } else {
        $(this.display).removeClass("highlight");
    }
};

PlayerDisplay.prototype.adjustPos = function () {

};

PlayerDisplay.prototype.setScoreText = function (text) {
    //  this.scoretext.innerHTML = text;
};

PlayerDisplay.prototype.setFinalText = function (text) {
    //  this.finaltext.innerHTML = text;
};

PlayerDisplay.prototype.highlight = function () {
    // var b = this.scoretext.classList;
    // b.add('highlight');
    // setTimeout(function(){
    //     b.remove('highlight');
    // }, 100);
};

const ChatDesk = function () {
    this.display = document.createElement('div');
    const chatsSider = document.createElement('div');
    chatsSider.classList = "chatsSider";
    chats.forEach(chatMess => {
        const chat = document.createElement('div');
        chat.innerHTML = chatMess;
        chat.className = "chatBox"
        chat.onclick = function () {
            window.gameEmitor("chat", chatMess);
        };
        chatsSider.appendChild(chat);
    });
    this.display.appendChild(chatsSider);
    this.display.className = 'chatDesk';
}


export default {
    fragmentToDom: function (dom) {
        if (frag) {
            dom.appendChild(frag);
            frag = null;
        }
    },
    createChatDesk: function () {
        const cd = new ChatDesk();
        frag.appendChild(cd.display);
    },
    createPlayerDisplay: function (id, name) {
        return new PlayerDisplay(id, name);
    },
    createCardDisplay: function (numtext, suit) {
        if (!frag) {
            frag = document.createDocumentFragment();
        }
        let display = document.createElement('div');
        display.className = 'card flipped';
        $(display).css({
            transform: 'rotateY(180deg)'
        });

        let numText = document.createElement('div');
        numText.className = 'num';
        numText.innerHTML = numtext;

        let front = document.createElement('div');
        front.className = 'front';
        //front.appendChild(numText);
        //display.classList.add(suits[suit]);
        let cardPicPos = getCardIconPos(numtext);

        let pic = document.createElement('div');
        $(pic).css({
            background: `url(../files/img/card/${suit}.png) ${cardPicPos.x}px ${cardPicPos.y}px`,
            scale: "1.2"
        });
        pic.className = 'card_pic';

        let icon = document.createElement('div');
        icon.className = 'icon';
        front.appendChild(icon);
        front.appendChild(pic);

        display.appendChild(front);

        let back = document.createElement('div');
        back.className = 'back';

        display.appendChild(back);

        frag.appendChild(display);

        return new CardDisplay(display);
    }
};
