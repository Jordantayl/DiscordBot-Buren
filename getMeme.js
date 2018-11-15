var request = require('request');
exports.memeSources = [
    'lotrmemes',
    'prequelmemes',
    'raimimemes',
    'HistoryMemes',
];

function getRandomSubJson(memeSources, callback) {
    var memeSource = memeSources[Math.floor(Math.random() * memeSources.length)];
    var topPostsJsonUrl = "https://reddit.com/r/" + memeSource + "/top/.json";
    var userAgentRequest = request.defaults({
        headers: { 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:62.0) Gecko/20100101 Firefox/62.0' }
    });
    userAgentRequest.get(topPostsJsonUrl, {}, function (error, response, body) {
        if (response.statusCode == 200) {
            callback(JSON.parse(body));
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

exports.getRandomImageUrl = function (memeSources, callback) {
    getRandomSubJson(memeSources, function (randomSubData) {
        var memeList = randomSubData.data.children;
        var memeData = memeList[Math.floor(Math.random() * memeList.length)];
        callback(memeData.data.url);
    });
}
