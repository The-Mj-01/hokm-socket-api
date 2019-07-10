let logs = [];
const Debug = {};
Debug.log = function (title, mess) {
    if (typeof mess === 'object') mess = JSON.stringify(mess);
    logs.push({title, mess});
};
Debug.show = function () {
    let wnd = window.open("about:blank", "", "_blank");
    logs.forEach((l) => {
        const s = window.document.createElement("div");
        s.innerHTML = `${l.title}----|----${l.mess}`;
        wnd.document.body.appendChild(s)
    });

};
export default Debug

