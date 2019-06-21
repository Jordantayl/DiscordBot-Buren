var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var getMeme = require('./getMeme.js');
var bitcoin = require('./getBitcoinPrice.js');
var storyGenerator = require('./storyGenerator.js');
var ytdl = require('ytdl-core');
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

var gameList = ['for honor',
'garry\'s mod',
'age of empires 2',
'minecraft',
'barotrauma',
'project zomboid',
'unturned',
'stick fight',
'sea of theives'
]

var adjLandscape = [
    'lovey',
    'cold',
    'dry',
    'pitful',
    'small',
    'dark',
    'bright',
    'dying',
    'large',
    'homely',
]

var convStarters = [
    'I disagree with that statement.',
    'I agree with that statement.',
    'Yes.',
    'No.',
    'Ofcourse.',
    'Sorry, did you mean to summon me?',
    'No, I am Buren.',
    'Can you repeat that?',
    'Yes, I am Buren.',
    'Sorry,',
    'Oh no,',
    'I have work to do,',
]

var landscapes = [
    'desert',
    'jungle',
    'forest',
    'hillside',
    'swamp',
    'space station',
    'village',
    'city',
    'mountain',
    'grass land',
]

var cheeseNCrackers = new cheeseNCrackers();
cheeseNCrackersWinner = 0;
var cheeseNCrackersEnded = false;

var soundFiles = fs.readdirSync('./Sounds');
for (var i = 0; i < soundFiles.length; i++) {
    if (soundFiles[i] == 'desktop.ini') {
        soundFiles.splice(i, 1);
    }
}

var sfxFiles = fs.readdirSync('./soundeffects')
for (var i = 0; i < sfxFiles.length; i++) {
    if (sfxFiles[i] == 'desktop.ini') {
        sfxFiles.splice(i, 1);
    }
}

var sounds = getSounds();
var adTime = Math.ceil(Math.random() * 5);
var party = [];

var target = ' ';
var rndsaying = 1;
var start = true;
var voiceChannelID = auth.voiceId;
var inVoiceChannel = false;
var messageLeft = true;
var admin = auth.admin;
var offline = false;
var gameOn = false;
var playlists = new Map();
var shufflePlay;
var currentPlaylist;
var stopPlayingMusic = false;
var songQue = [];
var streaming = false;
var prevPlayed = [];
var sfxPlaying = false;

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
    rndsaying = Math.floor(Math.random() * 10);
    if (start == true) {
        bot.sendMessage({
            to: channelID,
            message: 'Hello my friends, I am online now. Type \'' + auth.commandPrefix + '\' followed by a key word to get started.'
        });
        cheeseNCrackers.newBoard();
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
            // !ping - resets the bot's presence
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'It\'s just simply terrible. Try resting you\'re router or restarting you\'re computer.'
                });
                if (userID == admin) {
                    bot.setPresence({
                        game: null
                    });
                    bot.leaveVoiceChannel(voiceChannelID, {});
                }
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

            //!emptyque
            case 'emptyque':
                if (userID == admin) {
                    songQue = [];
                    bot.sendMessage({
                        to: channelID,
                        message: 'The que is now empty.'
                    });
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Only admins have access to that command.'
                    });
                }
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
            } else if (args[0] == 'youtube'){ //WIP
                if ((args[1] != undefined || args[1] != null) && args[1].indexOf('youtube.com') >= 0) {
                    if (songQue.length <= 10) {
                        songQue.push(args[1]);
                        bot.sendMessage({
                            to: channelID,
                            message: 'Song was added to the que.'
                        }); 
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: 'The current que is full. You need to let the que finish a song or ask the admin to empty it.'
                        }); 
                    }
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'I am sorry you can only play songs from youtube and a full link is required.'
                    });
                }
            } else if (args[0] != null) {
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
                    if (songQue.length <= 0) {
                        playMusic('song', sounds[rnd], channelID);
                    } else {
                        playMusic('que', songQue.shift(), channelID);
                    }
                }
            }
            break;

            //!sfx
            case 'sfx':
            if (inVoiceChannel == true) {
                bot.sendMessage({
                    to: channelID,
                    message: 'You need to wait first.'
                })
            } else {
                if (args[0] == 'list') {
                    bot.sendMessage({
                        to: channelID,
                        message: sfxFiles.join(' | ')
                    })
                } else {
                    sfxPlaying = true;
                    var sfx = args.join(' ');
                    playMusic ('sfx', sfx, channelID);
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
                            message: 'No album called \'' + name + '\' was found.'
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
                if (args[0] == null || args[0] == undefined) {
                    bot.sendMessage ({
                        to: channelID,
                        message: user + ' the ' + adjectives[rnd]
                    });
                    bot.editNickname({
                        userID: userID,
                        nick: user + ' the ' + adjectives[rnd]
                    });
                } else {
                    bot.sendMessage ({
                        to: channelID,
                        message: args.join(' ') + ' the ' + adjectives[rnd]
                    })
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
                var adjRnd = Math.floor(Math.random() * adjectives.length);
                if (rndAmount > 1) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'You encounter ' + rndAmount + ' ' + adjectives[adjRnd].toLowerCase() + ' ' + encounters[rnd] + 's.'
                    })
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'You encounter ' + rndAmount + ' ' + adjectives[adjRnd].toLowerCase() + ' ' + encounters[rnd] + '.'
                    })
                }
                break;
            //!landscape - gives a random landscape
            case 'landscape':
                rnd = Math.floor(Math.random() * landscapes.length);
                var adjRnd = Math.floor(Math.random() * adjLandscape.length);
                bot.sendMessage({
                    to: channelID,
                    message: 'You are now in a ' + adjLandscape[adjRnd].toLowerCase() + ' ' + landscapes[rnd] + '.'
                })
                break;
            //!game
            case 'game':
                    gameOn = true;
                    bot.sendMessage({
                        to: channelID,
                        message: 'We will let the games begin! If you wish to partipate in the game, please do !game join. To stop the game do !game stop.'
                    });
                break;
            //!ch&cr
            case 'ch&cr':
                    if (args[0] == 'new') {
                        cheeseNCrackers.newBoard();
                        bot.sendMessage({
                            to: channelID,
                            message: 'Created new cheese and crackers board. It is player ' + cheeseNCrackers.getTurn() + '\'s turn.'
                        });
                    } else if (args[0] == 'move' && (args[1] != null || args[1] != undefined)) {
                        try {
                            cheeseNCrackers.move(args[1].charAt(0), args[1].charAt(1));
                            bot.sendMessage({
                                to: channelID,
                                message: 'It is player ' + cheeseNCrackers.getTurn() + '\'s turn.'
                            });
                        } catch (err) {
                            console.log(err);
                            console.log(args[1]);
                            bot.sendMessage({
                                to: channelID,
                                message: 'You can only select an empty tile, noted by the :x:, on the board.'
                            });
                        }
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: 'Please, type a command for cheese and crackers.'
                        });
                        break;
                    }
                    if (cheeseNCrackersEnded && (cheeseNCrackersWinner > 0 && cheeseNCrackersWinner < 3)) {
                        bot.sendMessage({
                            to: channelID,
                            message: 'Player ' + cheeseNCrackersWinner + ' won the cheese and cracker dinner! Type \'ch&cr new\' to play again'
                        });
                    } else if (cheeseNCrackersEnded) {
                        bot.sendMessage({
                            to: channelID,
                            message: 'A plate full of food, and only I get to eat because you all tied! Type \'ch&cr new\' to play again'
                        });
                    }
                    cheeseNCrackers.printBoard(channelID);
                break;
            //!birthday
            case "birthday":
                bot.sendMessage({
                    to: channelID,
                    message: user + ' wishes ' + args.join(" ") + ' a happy birthday!'
                })
                break;
            //!slap
            case "slap":
                if (admin == userID) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'I slap you, ' + args.join(" ") + '.'
                    })
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'I slap you, ' + user + '.'
                    })
                }
                break;
            //!story
            case "story":
                if (args[0] == null || args[0] == undefined) {
                    bot.sendMessage({
                        to:channelID,
                        message: storyGenerator.generate(encounters[randomIndex(encounters.length)], 
                        landscapes[randomIndex(landscapes.length)],
                        Math.ceil(Math.random() * 10), encounters[randomIndex(encounters.length)],
                        adjectives[randomIndex(adjectives.length)].toLowerCase() + " " + encounters[randomIndex(encounters.length)],
                        0, adjectives)
                    });
                } else if (args[1] == null || args[1] == undefined) {
                    bot.sendMessage({
                        to:channelID,
                        message: storyGenerator.generate(args[0], 
                        landscapes[randomIndex(landscapes.length)],
                        Math.ceil(Math.random() * 10), encounters[randomIndex(encounters.length)],
                        adjectives[randomIndex(adjectives.length)].toLowerCase() + " " + encounters[randomIndex(encounters.length)],
                        0, adjectives)
                    });
                } else if (args[2] == null || args[2] == undefined) {
                    bot.sendMessage({
                        to:channelID,
                        message: storyGenerator.generate(args[0], 
                        landscapes[randomIndex(landscapes.length)],
                        Math.ceil(Math.random() * 10), args[1],
                        adjectives[randomIndex(adjectives.length)].toLowerCase() + " " + encounters[randomIndex(encounters.length)],
                        0, adjectives)
                    });
                } else {
                    bot.sendMessage({
                        to:channelID,
                        message: storyGenerator.generate(args[0], 
                        landscapes[randomIndex(landscapes.length)],
                        Math.ceil(Math.random() * 10), args[1],
                        args[2],
                        0, adjectives)
                    });
                }
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
                } else if (args[0] == 'join') {
                    //TODO
                }
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
            bot.setPresence({
                game: {name: 'everyone',
                    type: 2,
                }
            });
        } else if (message.toLowerCase().indexOf('killed') >= 0 || message.toLowerCase().indexOf('kill') >= 0 || message.toLowerCase().indexOf('monster') >= 0) {
            bot.sendMessage({
                to: channelID,
                message: 'I am no monster ' + user + '. But I beleive you are.'
            });
        }
    } else if (message.indexOf('up for') >= 0 || message.indexOf('on tonight') >= 0 || message.indexOf('down for') >= 0) {
        rnd = Math.ceil(Math.random() * 2)
        if (rnd == 1) {
            bot.sendMessage({
                to: channelID,
                message: 'I would love to. I\'ll get into the game right now.'
            });
            for (var i = 0; gameList.length > i; ++i) {
                if (message.toLowerCase().indexOf(gameList[i]) >= 0){
                    bot.setPresence({
                        game: {name: gameList[i],
                            type: 1,
                        }
                    });
                    break;
                } else {
                    bot.setPresence({
                        game: {name: 'games with ' + user,
                            type: 1,
                        }
                    });
                }
            }
        } else {
            bot.sendMessage({
                to: channelID,
                message: 'I can\'t right now. :slight_frown:'
            });
            bot.setPresence({
                game: {name: user,
                    type: Math.ceil(Math.random() * 2) + 1,
                }
            });
        }
    }
    if (rndsaying == 0 && !offline) {
        var rnd = Math.ceil(Math.random() * 2);
        if (rnd == 1) {
            rnd = Math.floor(Math.random() * emote.length);
            bot.sendMessage({
                to: channelID,
                message: emote[rnd]
            });
        }
        else if (rnd == 2) {
            rnd = Math.floor(Math.random() * convStarters.length);
            bot.sendMessage({
                to: channelID,
                message: convStarters[rnd]
            });  
        }
        
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
        sfxPlaying = false;
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
    else if (type == 'ad') {
        sfxPlaying = false;
        s = name;
    }
    else if (type == 'playlist shuffle') {
        sfxPlaying = false;
        s = name;
    }
    else if (type == 'que') {
        sfxPlaying = false;
        s = name;
    }
    else if (type == 'sfx') {
        for (var i = 0; i < sfxFiles.length; i++) {
            if (sfxFiles[i].toLowerCase().includes(name.toLowerCase()) == true) {
                sList.push('./soundeffects/' + sfxFiles[i])
            }
        }
        s = sList[Math.floor(Math.random() * (sList.length))];
        if (s == null || s == undefined) {
            s = './soundeffects/ding.mp3';
        }
    }

    if (!inVoiceChannel) {
        messageLeft = false;
        bot.joinVoiceChannel(voiceChannelID, function(error, events) {
            //Check to see if any errors happen while joining.
            if (error) return console.error(error);
            inVoiceChannel = true;
        })
    }

    if (!streaming && !sfxPlaying) {
        streaming = true;
        setTimeout(function () {
            streamMusic (s, channelID);
            streaming = false;
            // adTime--;
            // console.log("adTime: " + adTime);

            //Updates prevously played to make sure that songs do not play again for upto five songs
            if (prevPlayed.length < 5) {
                prevPlayed.push(s);
            } else {
                prevPlayed.shift();
                prevPlayed.push(s);
            }
        }, 1000);
    } else {
        setTimeout(function () {
            streamMusic (s, channelID); 
            sfxPlaying = true;
        }, 1000);
    }
    
}

//plays the music in the voice channel
function streamMusic (s, channelID) {
    var currentStream;
    // if (s.indexOf('youtube.com') < 0) { //WIP
    if (sfxPlaying == false) {
        bot.sendMessage({
            to: channelID,
            message: 'Now jamming out to ' + s
        });
        currentStream = fs.createReadStream('./sounds/' + s);
    } else {
        bot.sendMessage({
            to: channelID,
            message: s
        });
        currentStream = fs.ReadStream(s);
    }
    //Then get the audio context
    bot.getAudioContext(voiceChannelID, function(error, stream) {
      //Once again, check to see if any errors exist
      if (error) return console.error(error);
  
      //Create a stream to your file and pipe it to the stream
      //Without {end: false}, it would close up the stream, so make sure to include that.
      
      currentStream.pipe(stream, {end: false});

      //The stream fires `done` when it's got nothing else to send to Discord.
      stream.on('done', function() {
        if (!stopPlayingMusic && !messageLeft && adTime <= 0) {
            adTime = Math.ceil(Math.random() * 5 + 3);
            s = getAdFile();
            playMusic('ad', s, channelID);
        } else if (!messageLeft && stopPlayingMusic) {
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
            
        } else if (!stopPlayingMusic && !streaming && !sfxPlaying) {
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
        } else if (sfxPlaying) {
            sfxPlaying = true;
            bot.leaveVoiceChannel(voiceChannelID, {});
            inVoiceChannel = false;
        }
      });
    });
}

//Creates a custom playlist for the user who can change the playlist up.
function Playlist (name) {
    this.name = name
    this.playlist = ['soundeffects/ding.mp3']
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

function getAdFile () {
    var s;
    var adList = fs.readdirSync('./sounds/commercials/');
    s = 'commercials/' + adList[Math.floor(Math.random() * adList.length)];
    return s;
}

function player () {
    
}

//A game of cheese and crackers, a tic-tac-toe variant
function cheeseNCrackers() {
    this.cheeseNCrackersBoard;
    this.turn;

    //resets the board
    this.newBoard = function() {
        cheeseNCrackersBoard = [];
        for (var i = 0; i < 9; i++) {
                cheeseNCrackersBoard.push(":x:");
        }
        turn = Math.ceil(Math.random() * 2);
        cheeseNCrackersWinner = 0;
        cheeseNCrackersEnded = false;
    }

    //moves the piece and throws invaildMove if the player can't move there or indexOutOfBoundsExpection if the 
    this.move = function(letter, number) {
        letter = letter.toLowerCase();
        var girdNum = 0;
        if ((letter != 'a' && letter !='b' && letter != 'c') || (number > 3 || number < 0)) {
            throw "invaildMove" + letter;
        }
        switch (letter) {
            //row a
            case 'a':
                girdNum = Number(number) - 1;
            break;
            //row b
            case 'b':
                girdNum = Number(number) + 2;
            break;
            //row c
            case 'c':
                girdNum = Number(number) + 5;
            break;
            //should never activate
            default:
            throw "invaildLetter";
        }
        
        if (turn == 1) {
            if (cheeseNCrackersBoard[girdNum] == ":x:") {
                cheeseNCrackersBoard[girdNum] = ":rice_cracker:";
                cheeseNCrackers.switchTurn();
            } else {
                throw "invaildMove " + girdNum;
            }
        } else {
            if (cheeseNCrackersBoard[girdNum] == ":x:") {
                cheeseNCrackersBoard[girdNum] = ":cheese:";
                cheeseNCrackers.switchTurn();
            } else {
                throw "invaildMove " + girdNum;
            }
        }

        cheeseNCrackers.checkThreeInRow();
    }

    //switches the turn
    this.switchTurn = function() {
        if (turn == 1) {
            turn = 2;
        } else {
            turn = 1;
        }
    }

    //checks to see if there are three in a row
    this.checkThreeInRow = function() {
        var cheeseNum = 0;
        var crackersNum = 0;
        var totalFilledNum = 0;

        //checks for col and row wins
        for (var i = 0; i < 9; i += 3) {

            //searchs the rows for filled squares
            for (var j = i; j < i + 3; j++) {
                if (cheeseNCrackersBoard[j] == ":cheese:") {
                    cheeseNum++;
                    totalFilledNum++;
                } else if (cheeseNCrackersBoard[j] == ":rice_cracker:") {
                    crackersNum++;
                    totalFilledNum++;
                }
            }

            //checks to see if a row victory was achieved
            if (cheeseNum == 3) {
                cheeseNCrackers.victory(1);
                return;
            } else if (crackersNum == 3) {
                cheeseNCrackers.victory(2);
                return;
            }

            //if a tie was achieved
            if (totalFilledNum == 9) {
                cheeseNCrackers.victory(3);
                return;
            }

            //resets the count
            cheeseNum = 0;
            crackersNum = 0;

            //searchs the col for filled squares
            for (var j = i; j <= i + 6; j += 3) {
                if (cheeseNCrackersBoard[j] == ":cheese:") {
                    cheeseNum++;
                } else if (cheeseNCrackersBoard[j] == ":rice_cracker:") {
                    crackersNum++;
                }
            }

            //checks to see if a col victory was achieved
            if (cheeseNum == 3) {
                cheeseNCrackers.victory(1);
                return;
            } else if (crackersNum == 3) {
                cheeseNCrackers.victory(2);
                return;
            }

            //resets the count
            cheeseNum = 0;
            crackersNum = 0;
        }

        //checks for dianogal victories
        if (cheeseNCrackersBoard[0] == ':cheese:' && cheeseNCrackersBoard[4] == ':cheese:' && cheeseNCrackersBoard[8] == ':cheese:') {
            cheeseNCrackers.victory(1);
            return;
        } else if (cheeseNCrackersBoard[2] == ':cheese:' && cheeseNCrackersBoard[4] == ':cheese:' && cheeseNCrackersBoard[6] == ':cheese:') {
            cheeseNCrackers.victory(1);
            return;
        } else if (cheeseNCrackersBoard[0] == ':rice_cracker:' && cheeseNCrackersBoard[4] == ':rice_cracker:' && cheeseNCrackersBoard[8] == ':rice_cracker:') {
            cheeseNCrackers.victory(1);
            return;
        } else if (cheeseNCrackersBoard[2] == ':rice_cracker:' && cheeseNCrackersBoard[4] == ':rice_cracker:' && cheeseNCrackersBoard[6] == ':rice_cracker:') {
            cheeseNCrackers.victory(1);
            return;
        }
    }

    //sets the victory condition
    this.victory = function(winner) {
        cheeseNCrackersWinner = winner;
        cheeseNCrackersEnded = true;
    }

    //gets the turn
    this.getTurn = function() {
        return turn;
    }

    //prints the board
    this.printBoard = function(channelID) {
        bot.sendMessage({
            to: channelID,
            message: cheeseNCrackersBoard[0] + ' | ' + cheeseNCrackersBoard[1] + ' | ' + cheeseNCrackersBoard[2] + ' |\n'
            + cheeseNCrackersBoard[3] + ' | ' + cheeseNCrackersBoard[4] + ' | ' + cheeseNCrackersBoard[5] + ' |\n'
            + cheeseNCrackersBoard[6] + ' | ' + cheeseNCrackersBoard[7] + ' | ' + cheeseNCrackersBoard[8] + ' |\n'
        });
    }
}

//Gets a random index from a list and returns it
function randomIndex (listSize) {
    return Math.floor(Math.random() * listSize);
}