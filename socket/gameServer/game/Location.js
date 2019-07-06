const STN =  {
    bottom: 0,
    left: 1,
    top: 2,
    right: 3,
};
const NTS =  {
    0: "bottom",
    1: "left",
    2: "top",
    3: "right",
};

toName = function (number) {
    if (typeof number === 'number') return NTS[number];
    else return number
};

toNum = function (name) {
    if (typeof name === 'string') return STN[name];
    else return name
};

exports.nextof = function (location , value = 1) {
    return (toNum(location) + value) % 4;
};
exports.toName = toName;
exports.toNum = toNum;

