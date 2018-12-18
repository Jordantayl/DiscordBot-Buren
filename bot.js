var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var getMeme = require('./getMeme.js');
var bitcoin = require('./getBitcoinPrice.js');
var fs = require('fs');
var quote = ['All the lessons of history and experience must be lost upon us if we are content to trust alone to the peculiar advantages we happen to possess. - ' + auth.name,
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
    'It\'s a trap! - Admiral Ackbar',
];

var adjectives = ['Lovely',
'Eager',
'Brave',
'Coward',
'Wacky',
'Troubled',
'Serious',
'Unusual',
'Dramatic',
'Remarkable',
'Classy',
'Fair',
'Jealous',
'Disastrous',
'Abandoned',
'Electric',
'Grey',
'Flimsy',
'Dispensable',
'Selective',
'Bitter',
'Faithful',
'Cynical',
'Possessive',
'Defective',
'Drunk',
'Quick',
'Ordinary',
'Grotesque',
'Supreme',
'Marvelous',
];

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
];

var weapon = ['a sword',
    'a piece of bacon',
    'a herring',
    'a wrench',
    'my eyeballs',
    'pocket lint',
    'the bot named ' + auth.name,
    'this thumb',
    'fire',
    'my good looks',
    'exile',
    'a death star',
];

var encounters = ['skeleton',
'goblin',
'hobgoblin',
'banit',
'ghost',
'giant goat',
'devil',
'monkey',
'demon',
'chicken',
'chick',
'B1 battle droid',
'stromtrooper',
'nazi soldier',
'clone trooper',
'knight',
'sith',
'bounty hunter',
'Buren\'s minion',
'orc',
'navy seal',
];

var soundFiles = fs.readdirSync('./Sounds');
var sounds = getSounds();
var party = [];

var target = ' ';
var rndemote = 1;
var start = true;
var voiceChannelID = auth.voiceId;
var inVoiceChannel = false;
var messageLeft = true;
var admin = auth.admin;
var offline = false;
var gameOn;
var playlists = new Map();
var shufflePlay;
var currentPlaylist;
var stopPlayingMusic;
var songQue = [];
var streaming = false;
var prevPlayed = [];

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
            message: 'Hello my friends, I am online now. Type \'' + auth.commandPrefix + '\' followed by a key word to get started.'
        });
        start = false;
    } else if (offline && message.substring(0, 1) == auth.commandPrefix && userID != admin) {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var rnd = 0;

        args = args.splice(1);
        if (cmd == 'online') {
            offline == false;
            bot.sendMessage({
                to: channelID,
                message: 'Okay I am online now.'
            });
        }
    } else if (!gameOn && message.substring(0, 1) == auth.commandPrefix) {
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
                getMeme.getRandomImageUrl(getMeme.memeSources, function (url, title) {
                    bot.sendMessage({
                        to: channelID,
                        message: title
                    });
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
                    message: 'Huntin dem whale snarks. Huntin dem, killin dem, eatin dem. Nothin like huuntin dem whale snarks. Nothin lik it.'
                });
                break;
            // !hello
            case 'hello':
                bot.sendMessage({
                    to: channelID,
                    message: 'Hello, I am '+ auth.name +'. Type \'' + auth.commandPrefix + '\' followed by a key word such as d20 or meme to all me to active my one of my functions. Type \'' + auth.commandPrefix + 'help\' all my current commands'
                });
                break;
            // !command
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: 'Here are all my commands: https://docs.google.com/document/d/1j2Y4_F3APUHNWc8SfjuaOaZEFkLHIvWVQ7stay-fOm4/edit?usp=sharing.'
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
                    if (target.toLowerCase() == 'me' || target.toLowerCase() == auth.name.toLowerCase() || target.toLowerCase() == 'myself') {

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
                offline = true;
                break;
            // !online
            case 'online':
                bot.sendMessage({
                    to: channelID,
                    message: 'Okay I am online now.'
                });
                offline = false;
                break;
            // !facepalm
            case 'facepalm':
                bot.uploadFile({
                    to: channelID,
                    file: './images/Facepalm.gif'
                });
                break;
            //!play
            case 'play':
            rnd = Math.floor(Math.random() * sounds.length)
            stopPlayingMusic = false;
            if (args[0] == 'album') {
                bot.sendMessage({
                    to: channelID,
                    message: 'This function does not exist.'
                })
            } else if (args[0] == 'song') {
                if (songQue.length <= 10) {
                    try {
                        songQue.push(getSongFile(args.splice(1).join(' ')));
                        bot.sendMessage({
                            to: channelID,
                            message: 'Song was add to the que.'
                        });
                    } catch (error) {
                        if (error == 'tooManyOfSameType') {
                            bot.sendMessage({
                                to: channelID,
                                message: 'There are quite a few files by that name, please type the full name.'
                            });
                        }
                        else if (error == 'noSuchElementException') {
                            bot.sendMessage({
                                to: channelID,
                                message: 'That song does not exist.'
                            });
                        }
                    }
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'The current que is full. You need to let the que finish a song or ask the admin to empty it.'
                    });
                }
            } else if (args[0] == 'stop') {
                bot.sendMessage({
                    to: channelID,
                    message: 'Okay I will stop playing music now.'
                });
                stopPlayingMusic = true;
            } else if (args[0] == 'que') {
                bot.sendMessage({
                    to: channelID,
                    message: 'There are '+ songQue.length + ' items waiting in the que. Here\'s the current que:\n' + songQue.join('\n')
                });
            } else if (args[0] != null) {
                bot.sendMessage({
                    to: channelID,
                    message: 'I am sorry, you need to type in song, album, or stop.'
                });
                return;
            } else {
                if (sounds[rnd] == null) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'I am sorry, something went wrong. Try again.'
                    });
                    break;
                }
                if (!inVoiceChannel) {
                    playMusic('song', sounds[rnd], channelID);
                }
            }
            break;
                //!vote
            case 'vote':
                rnd = Math.ceil(Math.random() * 2)
                if (rnd == 1) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'I vote for.'
                    });
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'I vote against.'
                    });
                }
                break;
                //!y/n - yes/no
            case 'y/n':
                rnd = Math.ceil(Math.random() * 2)
                if (rnd == 1) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Yes.'
                    });
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'No.'
                    });
                }
                break;
                //!a/d - agreed/disagree
            case 'a/d':
                rnd = Math.ceil(Math.random() * 2)
                if (rnd == 1) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'I agreed.'
                    });
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'I disagreed.'
                    });
                }
                break;
                //!t/f - true/false
            case 't/f':
                rnd = Math.ceil(Math.random() * 2)
                if (rnd == 1) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'True.'
                    });
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'False.'
                    });
                }
                break;
            case 'bitcoin':
                bitcoin.getBitcoinPrice(function (price) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'The current price of Bitcoin according to CoinDesk is: $' + price
                    });
                });
                break;
                //!albums
            case 'albums':
                bot.sendMessage({
                    to: channelID,
                    message: 'Here are all the albums: ' + soundFiles.join(', ')
                })
                break;
                //!songs
            case 'songs':
                var sList;
                var name = args.join(' ');
                if (args[0] == null) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'you need to add album name to the end.'
                    })
                } else {
                    for (var i = 0; i < soundFiles.length; ++i) {
                        if (soundFiles[i].toLowerCase().includes(name.toLowerCase()) == true) {
                            albumName = soundFiles[i];
                            sList = fs.readdirSync('./Sounds/' + soundFiles[i] + '/')
                        }
                    }
                    if (sList == null) {
                        bot.sendMessage({
                            to: channelID,
                            message: 'No album called \'' + albumName + '\' was found.'
                        })
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: 'Here are all the song in ' + albumName + ':\n' + sList.join('\n')
                        })
                    }
                }
                break;
                //!playlist
            case 'playlist':
                if (args[0] == undefined || args == null) {
                        if (!playlists.has(user)) {
                            playlists.set(user, new Playlist(user + '\'s Playlist'));
                            bot.sendMessage ({
                                to: channelID,
                                message: user + ' just created a new playlist!'
                            })
                        } else {
                            shufflePlay = true;
                            currentPlaylist = playlists.get(user);
                            if (currentPlaylist.getPlaylistLength() > 5) {
                                bot.sendMessage({
                                    to: channelID,
                                    message: 'I am now jamming out to ' + currentPlaylist.getName() +'.'
                                })
                                if (!inVoiceChannel) {
                                    var tempPlaylist = currentPlaylist.getPlaylist();
                                    rnd = Math.floor(Math.random() * tempPlaylist.length);
                                    playMusic('playlist shuffle', tempPlaylist[rnd], channelID);
                                }
                            } else {
                                bot.sendMessage({
                                    to: channelID,
                                    message: currentPlaylist.getName() + ' is to small. Please add more songs.'
                                })
                            }
                        }
                } else if (args[0] == 'stop') {
                    shufflePlay = false;
                    stopPlayingMusic = true;
                    bot.sendMessage({
                        to: channelID,
                        message: 'Okay, I\'ll stop playing music after this song.'
                    })
                } else if (args[0] == 'name') {
                        if (playlists.has(name)) {
                            if (!shufflePlay) {
                                shufflePlay = true;
                            }
                            currentPlaylist = playlists.get(user);
                            bot.sendMessage({
                                to: channelID,
                                message: 'I am now jamming out to ' + currentPlaylist.getName() + '.'
                            })
                            if (!inVoiceChannel) {
                                var tempPlaylist = currentPlaylist.getPlaylist();
                                rnd = Math.floor(Math.random() * tempPlaylist.length);
                                playMusic('playlist shuffle', tempPlaylist[rnd], channelID);
                            }
                        } else {
                            bot.sendMessage({
                                to: channelID,
                                message: 'That playlist does not exist. Try check the name again.'
                            })
                        }
                } else if (args[0] == 'length') {
                    if (args[1] == undefined) {
                        if (playlists.has(user)) {
                            playlistTitle = playlists.get(user).getName();
                            bot.sendMessage({
                                to: channelID,
                                message: 'Your playlist has ' +  playlists.get(user).getPlaylistLength() + ' songs.'
                            })
                        } else {
                            bot.sendMessage({
                                to: channelID,
                                message: 'You need to create a playlist first or type the creators name or title of the playlist after \'length\'.'
                            })
                        }
                    } else {
                        playlistTitle = args.splice(1).join(' ');
                        if (playlists.has(playlistTitle)) {
                            bot.sendMessage({
                                to: channelID,
                                message: 'It has ' +  playlists.get(user).getPlaylistLength() + ' songs.'
                            })
                        } else {
                            bot.sendMessage({
                                to: channelID,
                                message: 'That playlist does not exist. Try check the name again.'
                            })
                        }
                    }
                } else if (args[0] == 'songs') {
                    if (args[1] == null) {
                        if (playlists.has(user)) {
                            playlistTitle = playlists.get(user).getName();
                            bot.sendMessage({
                                to: channelID,                                                    //IMPORTANT PLAYLISTS.GET(USER)
                                message: 'Here are all the songs for ' + playlistTitle + ':\n' +  playlists.get(user).getPlaylist().join('\n')
                            })
                        } else {
                            bot.sendMessage({
                                to: channelID,
                                message: 'You need to create a playlist first or type the creators name or title of the playlist after \'songs\'.'
                            })
                        }
                    } else {
                        playlistTitle = args.splice(1).join(' ');
                        if (playlists.has(playlistTitle)) {
                            bot.sendMessage({
                                to: channelID,
                                message: 'Here are all the songs for ' + playlistTitle + ':\n' +  playlists.get(playlistTitle).getPlaylist().join('\n')
                            })
                        } else {
                            bot.sendMessage({
                                to: channelID,
                                message: 'That playlist does not exist. Try checking the name again.'
                            })
                        }
                    }
                } else if (args[0] == 'add') {
                    songName = args.splice(1).join(' ');
                    if (playlists.has(user)) {
                        try {
                            if (playlists.get(user).getPlaylist().indexOf(getSongFile(songName)) >= 0) {
                                bot.sendMessage({
                                    to: channelID,
                                    message: 'That song is already in you playlist.'
                                })
                                break;
                            }
                            playlists.get(user).add(songName);
                            bot.sendMessage({
                                to: channelID,
                                message: 'Song added from your playlist.'
                            })
                        } catch (err) {
                            if (err == "noSuchElementException") {
                                bot.sendMessage({
                                    to: channelID,
                                    message: 'That song does not exist so it cannot be added.'
                                })
                            } else if (err == "tooManyOfSameType") {
                                bot.sendMessage({
                                    to: channelID,
                                    message: 'Many songs share that same name. Refine your search.'
                                })
                            } else {
                                console.log(err);
                            }
                        }
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: 'You haven\'t created a playlist yet! Do \'!playlist\' to initailize your playlist.'
                        })
                    }
                } else if (args[0] == 'remove') {
                        songName = args.splice(1).join(' ');
                        if (playlists.has(user)) {
                            try {
                                playlists.get(user).remove(songName);
                                bot.sendMessage({
                                    to: channelID,
                                    message: 'Song removed from your playlist.'
                                })
                            } catch (err) {
                                if (err == "noSuchElementException") {
                                    bot.sendMessage({
                                        to: channelID,
                                        message: 'That song does not exist so it cannot be removed.'
                                    })
                                } else if (err == "tooManyOfSameType") {
                                    bot.sendMessage({
                                        to: channelID,
                                        message: 'Many songs in the playlist share that same name. Refine your search.'
                                    })
                                } else {
                                    console.log(err);
                                }
                            }
                        } else {
                            bot.sendMessage({
                                to: channelID,
                                message: 'You haven\'t created a playlist yet! Do \'!playlist\' to initailize your playlist.'
                            })
                        }
                }
                break;
            //!adjective
            case 'adjective':
                rnd = Math.floor(Math.random() * adjectives.length);
                bot.sendMessage ({
                    to: channelID,
                    message: args.join(' ') + ' the ' + adjectives[rnd]
                })
                break;

            //!encounter - gives a random encounter with the defualt being and number between 1 and 6
            case 'encounter':
                var rndAmount;
                if (args[0] == 'd3') {
                    rndAmount = Math.ceil(Math.random() * 3);
                } else if (args[0] == 'd4') {
                    rndAmount = Math.ceil(Math.random() * 4);
                } else if (args[0] == 'd6') {
                    rndAmount = Math.ceil(Math.random() * 6);
                } else if (args[0] == 'd8') {
                    rndAmount = Math.ceil(Math.random() * 8);
                } else if (args[0] == 'd10') {
                    rndAmount = Math.ceil(Math.random() * 10);
                } else if (args[0] == 'd12') {
                    rndAmount = Math.ceil(Math.random() * 12);
                } else if (args[0] == 'd20') {
                    rndAmount = Math.ceil(Math.random() * 20);
                } else if (args[0] == 'd100') {
                    rndAmount = Math.ceil(Math.random() * 100);
                } else if (args[0] == undefined || args[0] == null) {
                    rndAmount = Math.ceil(Math.random() * 6);
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'You need to leave this area blank or add a dice amount such as a d4 or d6.'
                    })
                    break;
                }
                rnd = Math.floor(Math.random() * encounters.length);
                if (rndAmount > 1) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'You encounter ' + rndAmount + ' ' + encounters[rnd] + 's.'
                    })
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'You encounter ' + rndAmount + ' ' + encounters[rnd] + '.'
                    })
                }
                break;

                //!game
            case 'game':
                    gameOn = true;
                    bot.sendMessage({
                        to: channelID,
                        message: 'We will let the games begin! If you wish to partipate in the game, please do !game join. To stop the game do !game stop.'
                    });
                break;
            default:
                bot.sendMessage({
                    to: channelID,
                    message: 'I\'m sorry, but you got me confused at \'' + cmd + '.\''
                });
                break;
        }
    } else if (gameOn && message.substring(0, 1) == auth.commandPrefix) {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var rnd = 0;

        args = args.splice(1);
        switch (cmd) {
        //!game - game commands
            case 'game':
                if (args[0] == 'stop') { //stop the game and resets it
                    gameOn = false;
                    party = [];
                }
                break;

        //!encounter - gives a random encounter with the defualt being and number between 1 and 6
            case 'encounter':
                var rndAmount;
                if (args[0] == 'd3') {
                    rndAmount = Math.ceil(Math.random() * 3);
                } else if (args[0] == 'd4') {
                    rndAmount = Math.ceil(Math.random() * 4);
                } else if (args[0] == 'd6') {
                    rndAmount = Math.ceil(Math.random() * 6);
                } else if (args[0] == 'd8') {
                    rndAmount = Math.ceil(Math.random() * 8);
                } else if (args[0] == 'd10') {
                    rndAmount = Math.ceil(Math.random() * 10);
                } else if (args[0] == 'd12') {
                    rndAmount = Math.ceil(Math.random() * 12);
                } else if (args[0] == 'd20') {
                    rndAmount = Math.ceil(Math.random() * 20);
                } else if (args[0] == 'd100') {
                    rndAmount = Math.ceil(Math.random() * 100);
                } else if (args[0] == undefined || args[0] == null) {
                    rndAmount = Math.ceil(Math.random() * 6);
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'You need to leave this area blank or add a dice amount such as a d4 or d6.'
                    })
                    break;
                }
                rnd = Math.floor(Math.random() * encounters.length);
                if (rndAmount > 1) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'You encounter ' + rndAmount + ' ' + encounters[rnd] + 's.'
                    })
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'You encounter ' + rndAmount + ' ' + encounters[rnd] + '.'
                    })
                }
                break;

            default:
                bot.sendMessage({
                    to: channelID,
                    message: 'I\'m sorry, but you got me confused at \'' + cmd + '.\''
                });
                break;
        }
    } else if (message.toLowerCase().indexOf(auth.name.toLowerCase()) >= 0) {
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
    } else if (message.indexOf('up for') >= 0 || message.indexOf('on tonight') >= 0 || message.indexOf('down for') >= 0) {
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
    if (rndemote == 0 && !offline) {
        rnd = Math.floor(Math.random() * emote.length);
        bot.sendMessage({
            to: channelID,
            message: emote[rnd]
        });
    }
});

//gets all the albums in Sounds
function getSounds () {
    var s = [];
    var tempArray = [];
    for (var i = 0; i < soundFiles.length; ++i) {
        tempArray.push(fs.readdirSync('./sounds/' + soundFiles[i] + '/'));
    }

    for (var i = 0; i < tempArray.length; ++i) {
        var temp = tempArray[i]
        for (var j = 0; j < temp.length; ++j) {
            s.push(temp[j])
        }
    }

    return s;
}

/**
 * playMusic allows the bot to play music either at random, by song name, or randomly by file name.
 */
function playMusic (type, name, channelID) {
    var s;
    var sList = [];
    // plays by album name
    if (type == 'album') {
        for (var i = 0; i < soundFiles.length; ++i) {
            if (soundFiles[i].toLowerCase().includes(name.toLowerCase()) == true) {
                sList = fs.readdirSync('./Sounds/' + soundFiles[i] + '/')
                rnd = Math.floor(Math.random() * sList.length)
                s = soundFiles[i] + '/' + sList[rnd];
            }
        }
        if (s == null) {
            console.log('No file with the name \'' + name + '\' was found.')
            bot.sendMessage({
                to: channelID,
                message: 'No file with the name \'' + name + '\' was found.'
            });
            return;
        }
    } // plays by song name
    else if (type == 'song') {
        for (var i = 0; i < soundFiles.length; ++i) {
            var tempList = fs.readdirSync('./sounds/' + soundFiles[i] + '/')
            for (var j = 0; j < tempList.length; ++j) {
                if (tempList[j].toLowerCase().includes(name.toLowerCase()) == true) {
                    if (s != null) {
                        sList.push(s);
                    }
                    s = soundFiles[i] + '/' + tempList[j]
                }
            }
        }
        if (sList.length > 1) {
            sList.push(s);
            bot.sendMessage({
                to: channelID,
                message: sList.length + ' songs were found with the name \'' + name + '\'. Here they are:' + sList
            })

            return;
        } else if (s == null) {
            bot.sendMessage({
                to: channelID,
                message: 'No songs with the name \'' + name + '\' were found.'
            })
            return;
        }

    }
    else if (type == 'playlist shuffle') {
        s = name;
    } else if (type == 'que') {
        s = name;
    }

    if (!inVoiceChannel) {
        messageLeft = false;
        bot.joinVoiceChannel(voiceChannelID, function(error, events) {
            //Check to see if any errors happen while joining.
            if (error) return console.error(error);
            inVoiceChannel = true;
        })
    }

    if (!streaming) {
        streaming = true;
        setTimeout(function () {
            streamMusic (s, channelID);
            streaming = false;

            //Updates prevously played to make sure that songs do not play again for upto five songs
            if (prevPlayed.length < 5) {
                prevPlayed.push(s);
            } else {
                prevPlayed.shift();
                prevPlayed.push(s);
            }
        }, 1000);
    }
    
}

//plays the music in the voice channel
function streamMusic (s, channelID) {
    var currentStream = fs.createReadStream('./sounds/' + s);
    
    //Then get the audio context
    bot.getAudioContext(voiceChannelID, function(error, stream) {
      //Once again, check to see if any errors exist
      if (error) return console.error(error);
  
      //Create a stream to your file and pipe it to the stream
      //Without {end: false}, it would close up the stream, so make sure to include that.
      
      currentStream.pipe(stream, {end: false});
            bot.sendMessage({
              to: channelID,
              message: 'Now jamming out to ' + s
            });

      //The stream fires `done` when it's got nothing else to send to Discord.
      stream.on('done', function() {
        if (!messageLeft && stopPlayingMusic) {
            bot.leaveVoiceChannel(voiceChannelID, {});
            bot.sendMessage({
                to: channelID,
                message: 'The song has ended.'
            });
            inVoiceChannel = false;
            messageLeft = true;
        } else if (shufflePlay) {
            var tempPlaylist = currentPlaylist.getPlaylist();
            rnd = Math.floor(Math.random() * tempPlaylist.length);
            var s = tempPlaylist[rnd];
            while (prevPlayed.indexOf(s) >= 0) {
                rnd = Math.floor(Math.random() * tempPlaylist.length);
                s = tempPlaylist[rnd];
                console.log('prevPlayed Loop Active...')
            }
            playMusic('playlist shuffle', s, channelID);
            
        } else if (!stopPlayingMusic && !streaming) {
            if (songQue.length > 0) {
                playMusic('que', songQue.shift(), channelID);
            } else {
                rnd = Math.floor(Math.random() * sounds.length);
                var s = sounds[rnd];
                if (s == null) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'I am sorry, something went wrong. Try again.'
                    });
                }
                while (prevPlayed.indexOf(s) >= 0) {
                    rnd = Math.floor(Math.random() * sounds.length);
                    s = getSongFile(s);c
                }
                playMusic('song', s, channelID);
            }
        }
      });
    });
}

//Creates a custom playlist for the user who can change the playlist up. FIXME!!!
function Playlist (name) {
    this.name = name
    this.playlist = ['sfx/ding.mp3']
    this.add = function(name) {
        try {
            var s = getSongFile(name);
        } catch (err) {
            throw err;
        }
        this.playlist.push(s);
    }
    this.remove = function(name) {
            try {
                var s = getSongFile(name);
            } catch (err) {
                throw err;
            }
            this.playlist = this.playlist.filter(function(songName){
                return songName != s;
            });
    }
    this.getName = function() {
        return this.name;
    }
    this.getPlaylistLength = function () {
        return this.playlist.length;
    }
    this.getPlaylist = function () {
        return this.playlist;
    }
}

function getSongFile (name) {
    var s;
    var sList = [];
    for (var i = 0; i < soundFiles.length; ++i) {
        var tempList = fs.readdirSync('./sounds/' + soundFiles[i] + '/')
        for (var j = 0; j < tempList.length; ++j) {
            if (tempList[j].toLowerCase().includes(name.toLowerCase()) == true) {
                if (s != null) {
                    sList.push(s);
                }
                s =  soundFiles[i] + '/' + tempList[j]
            }
        }
    }
    if (sList.length > 1) {
        throw "tooManyOfSameType";
    } else if (s == null) {
        throw "noSuchElementException";
    }

    return s;
}