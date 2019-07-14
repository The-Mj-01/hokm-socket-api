const STN =  {
    bottom: 0,
    left: 1,
    top: 2,
    right: 3,
};

toNum = function (name) {
    if (typeof name === 'string') return STN[name];
    else return name
};

exports.nextof = function (location , value = 1) {
    return (toNum(location) + value) % 4;
};
exports.toNum = toNum;

