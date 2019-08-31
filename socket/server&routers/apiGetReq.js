const Axios = require("axios");

get = function(option, callback) {
  let url = option.url;

  const response = Axios({
    url,
    method: "GET"
  }).then(function(data) {
    callback(data.data);
  });
};
post = function(url, data, cb) {
  Axios({
    url,
    data,
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    }
  })
    .then(response => {
      if (response) cb(response.data);
    })
    .catch(error => {
      console.log("POST ERR");
      if (error) {
        try {
          cb(error.response.data);
          console.log(error.response.data);
        } catch (e) {
          console.log(error);
        }
      }
    });
};

exports.get = get;
exports.post = post;
