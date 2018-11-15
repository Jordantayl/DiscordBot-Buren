var request = require('request');

exports.getBitcoinPrice = function (callback) {
    var apiUrl = 'https://api.coindesk.com/v1/bpi/currentprice.json';
    var userAgentRequest = request.defaults({
        headers: { 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:62.0) Gecko/20100101 Firefox/62.0' }
    });
    userAgentRequest.get(apiUrl, {}, function (error, response, body) {
        if (response.statusCode == 200) {
            callback(JSON.parse(body).bpi.USD.rate);
        } else {
            console.log(response.status);
            console.log(body);
            callback({
                'status': response.statusCode,
                'error': error
            });
        }
    });
}
