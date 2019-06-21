var request = require('request');
var actionVerb = [
    "running",
    "brusting",
    "walking",
    "leaping",
    "flying",
    "stumbling",
    "breathing",
    "rushing",
    "charging",
    "coughing",
]
var pastActionVerb = [
    "ran",
    "dodged",
    "punched",
    "darted",
    "fled",
    "looked",
    "grinned",
    "walked",
    "leapeds",
    "charged",
    "coughed",
]
var attackAction = [
    "punched",
    "slapped",
    "slaughtered",
    "ripped apart",
    "gobbled",
    "blown away",
    "murdered",
    "burened",
    "burned",
    "cursed",
    "spit upon",
]
this.generate = function (protag, enviroment, enemyCount, sideEnemy, antitag, setting, adjectives) {
    if (setting == 0) {
            protagAdjective = adjectives[randomIndex(adjectives.length)].toLowerCase();
            return "Once upon a time the " + protagAdjective + " "
            + protag + " was " + actionVerb[randomIndex(actionVerb.length)] + " in a " + enviroment + " when "
            + enemyCount + " " + sideEnemy + "s came " + actionVerb[randomIndex(actionVerb.length)] + " towards the " + protag + "."
            + " The " + protagAdjective + " " + protag + " " + pastActionVerb[randomIndex(actionVerb.length)] + " towards the " + sideEnemy + "s"
            + " but the " + protag + " was " + attackAction[randomIndex(attackAction.length)] + " by the " + antitag + ". The end."
    }
}

function randomIndex (listSize) {
    return Math.floor(Math.random() * listSize);
}