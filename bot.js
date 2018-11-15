var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var getMeme = require('./getMeme.js');
var bitcoin = require('./getBitcoinPrice.js');
var quote = ['All the lessons of history and experience must be lost upon us if we are content to trust alone to the peculiar advantages we happen to possess. - Buren',
    'Don\'t cry because it\'s over, smile because it happened. - Dr. Sesuss',
    'Be yourself; everyone else is already taken. - Oscar Wilde',
    'Oof - Robloxs',
    'A room without books is like a body without a soul. - Marcus Tullius Cicero',
    'Friendship...is born at the moment when one man says to another "What! You too? I thought that no one but myself... - C.S. Lewis',
    '...Thou shalt not tempt the Lord thy God. - Jesus Christ',
    'Adam fell that men might be; and men are, that they might have joy. - Nephi',
    'Always pass on what you have learned. - Yoda',
    'In a dark place we find ourselves, and a little more knowledge lights our way, - Yoda',
    'I am altering the deal, pray I do not alter it any further… – Vader',
    'No, I am your father! - Vader',
    'The problem with quotes on the Internet is that it is hard to verify their authenticity. - Abraham Lincoln',
    'it\'s a trap! - Admiral Ackbar',
]

var emote = [':no_mouth:',
    ':slight_frown:',
    ':smiley:',
    ':poop:',
    ':slight_smile:',
    ':smirk:',
    ':ok_hand:',
    ':zipper_mouth:',
    ':neutral_face:',
    ':expressionless:',
    ':open_mouth:',
    ':fire:',
    ':heart_eyes:',
    ':vulcan:',
    ':yum:',
    ':100:',
    ':joy:',
    ':stuck_out_tongue:',
    ':cold_sweat:',
    ':sunglasses:',
    ':confused:',
    ':metal:',
    ':innocent:',
    ':angry:',
    ':rage:',
    ':scream:',
]

var weapon = ['a sword',
    'a piece of bacon',
    'a herring',
    'a wrench',
    'my eyeballs',
    'pocket lint',
    'the bot named Buren',
    'this thumb',
    'fire',
    'my good looks',
]

var target = ' ';
var rndemote = 1;
var start = true;
var conqueror = false;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    rndemote = Math.floor(Math.random() * 10);
    if (start == true) {
        bot.sendMessage({
            to: channelID,
            message: 'Hello my friends, I am online now.'
        });
        start = false;
    }
    else if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var rnd = 0;

        args = args.splice(1);
        switch (cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'It\'s just simply terrible. Try resting you\'re router or restarting you\'re computer.'
                });
                break;
            // !d20 - rolls a d20
            case 'd20':
                rnd = Math.ceil(Math.random() * 20);
                bot.sendMessage({
                    to: channelID,
                    message: 'You got ' + rnd + '.'
                });
                break;
            // !d100 - rolls a d100
            case 'd100':
                rnd = Math.ceil(Math.random() * 100);
                bot.sendMessage({
                    to: channelID,
                    message: 'You got ' + rnd + '.'
                });
                break;
            // !d12 - rolls a d12
            case 'd12':
                rnd = Math.ceil(Math.random() * 12);
                bot.sendMessage({
                    to: channelID,
                    message: 'You got ' + rnd + '.'
                });
                break;
            // !d10 - rolls a d10
            case 'd10':
                rnd = Math.ceil(Math.random() * 10);
                bot.sendMessage({
                    to: channelID,
                    message: 'You got ' + rnd + '.'
                });
                break;
            // !d8 - rolls a d8
            case 'd8':
                rnd = Math.ceil(Math.random() * 8);
                bot.sendMessage({
                    to: channelID,
                    message: 'You got ' + rnd + '.'
                });
                break;
            // !d6 - rolls a d6
            case 'd6':
                rnd = Math.ceil(Math.random() * 6);
                bot.sendMessage({
                    to: channelID,
                    message: 'You got ' + rnd + '.'
                });
                break;
            // !d4 - rolls a d4
            case 'd4':
                rnd = Math.ceil(Math.random() * 4);
                bot.sendMessage({
                    to: channelID,
                    message: 'You got ' + rnd + '.'
                });
                break;
            // !d3 - rolls a d3
            case 'd3':
                rnd = Math.ceil(Math.random() * 3);
                bot.sendMessage({
                    to: channelID,
                    message: 'You got ' + rnd + '.'
                });
                break;
            // !mod
            case 'mod':
                bot.sendMessage({
                    to: channelID,
                    message: 'I afraid I can\'t let you have that power yet.'
                });
                break;
            // !buren
            case 'quote':
                rnd = Math.floor(Math.random() * quote.length);
                bot.sendMessage({
                    to: channelID,
                    message: quote[rnd]
                });
                break;
            // !meme
            case 'meme':
                getMeme.getRandomImageUrl(getMeme.memeSources, function (url) {
                    bot.sendMessage({
                        to: channelID,
                        message: url
                    });
                });
                break;
            // !whale-snark
            case 'whale-snark':
                bot.sendMessage({
                    to: channelID,
                    message: 'Nothin like huntin dem.'
                });
                break;
            // !hello
            case 'hello':
                bot.sendMessage({
                    to: channelID,
                    message: 'Hello, I am Buren. Type \'!command\' to talk to me such as \'!d20\' and \'!quote\''
                });
                break;
            // !command
            case 'command':
                bot.sendMessage({
                    to: channelID,
                    message: 'Command? Oh okay here are the list of my most important commands: !d20, !meme, !quote, !rate and !ping. See https://docs.google.com/document/d/1j2Y4_F3APUHNWc8SfjuaOaZEFkLHIvWVQ7stay-fOm4/edit?usp=sharing for more commands.'
                });
                break;
            // !thanks
            case 'thanks':
                bot.sendMessage({
                    to: channelID,
                    message: 'You are welcome.'
                });
                break;
            // !rate
            case 'rate':
                rnd = Math.floor(Math.random() * 6);
                bot.sendMessage({
                    to: channelID,
                    message: 'I\'ll rate that at ' + rnd + ' stars.'
                });
                break;
            // !emote
            case 'emote':
                rnd = Math.floor(Math.random() * emote.length);
                bot.sendMessage({
                    to: channelID,
                    message: emote[rnd]
                });
                break;
            // !target
            case 'target':
                if (args[0] == null) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Type !target \'name\' to select a target.'
                    });
                } else {
                    target = args.join(' ')
                    bot.sendMessage({
                        to: channelID,
                        message: 'Okay target set.'
                    });
                }
                break;
            // !kill
            case 'kill':
                rnd = Math.floor(Math.random() * weapon.length);
                if (target != ' ') {
                    if (target.toLowerCase() == 'me' || target.toLowerCase() == 'buren' || target.toLowerCase() == 'myself') {

                        bot.sendMessage({
                            to: channelID,
                            message: 'No, I will not plot my own murder.'
                        });
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: 'Plotting murder against ' + target + ' using ' + weapon[rnd] + '.'
                        });
                    }
                    target = ' ';
                }
                break;
            // !challenge name type
            case 'challenge':
                bot.sendMessage({
                    to: channelID,
                    message: user + ' has challenged ' + args[0] + ' to ' + args.splice(1).join(' ') + '.'
                });
                break;
            // !offline
            case 'offline':
                bot.sendMessage({
                    to: channelID,
                    message: 'Okay I\'ll leave you alone for a bit.'
                });
            // !conqueror - spams rah
            case 'conqueror':
                if (conqueror == true) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Let the terror stop'
                    });
                    conqueror = false;
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Let the terror begin'
                    });
                    conqueror = true;
                }
                break;
            //!music - plays a tune FIXME
            case 'music':
                // Only try to join the sender's voice channel if they are in one themselves
                // if (user.voiceChannel) {
                // voiceChannel.join()
                //     .then(connection => { // Connection is an instance of VoiceConnection
                //     message.reply('I have successfully connected to the channel!');
                //     })
                //     .catch(console.log);
                // } else {
                // message.reply('You need to join a voice channel first!');
                // }
                break;
            case 'bitcoin':
                bitcoin.getBitcoinPrice(function (price) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'The current price of Bitcoin according to CoinDesk is: $' + price
                    });
                });
                break;
            default:
                bot.sendMessage({
                    to: channelID,
                    message: 'I\'m sorry, but you got me confused at \'' + cmd + '.\''
                });
        }
    }
    else if (message.toLowerCase().indexOf('buren') >= 0) {
        if (message.toLowerCase().indexOf('offline') >= 0) {
            bot.sendMessage({
                to: channelID,
                message: 'I am always listening, ' + user + '.'
            });
        } else if (message.toLowerCase().indexOf('killed') >= 0 || message.toLowerCase().indexOf('kill') >= 0 || message.toLowerCase().indexOf('monster') >= 0) {
            bot.sendMessage({
                to: channelID,
                message: 'I am no monster ' + user + '. But I belive you are.'
            });
        }
    } else if (message.indexOf('play') >= 0 || message.indexOf('up for') >= 0 || message.indexOf('on tonight') >= 0 || message.indexOf('down for') >= 0) {
        rnd = Math.ceil(Math.random() * 2)
        if (rnd == 1) {
            bot.sendMessage({
                to: channelID,
                message: 'I would love to. I\'ll get into the game right now.'
            });
        } else {
            bot.sendMessage({
                to: channelID,
                message: 'I can\'t right now. :slight_frown:'
            });
        }
    }
    if (rndemote == 0) {
        rnd = Math.floor(Math.random() * emote.length);
        bot.sendMessage({
            to: channelID,
            message: emote[rnd]
        });
    }
    if (conqueror == true) {
        rnd = Math.floor(Math.random() * 10);
        var msg = 'Rah! ';
        for (var i = 0; i <= rnd; ++i) {
            msg.concat('Rah! ')
        }
        bot.sendMessage({
            to: channelID,
            message: msg + ''
        });
    }
});