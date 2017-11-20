let wordLists = require("./keywords.js")
let Discord = require("discord.js");
let giphy = require("giphy-api")(process.env.GIPHY_SECRET);

const secret = process.env.DISCORD_SECRET;
let bot = new Discord.Client({disableEveryone: true});
let timeLastSuccessfulMessageWasSent = new Date();
let timeToWait = 120 * 1000; /* Seconds times 1000ms */
let words = wordLists.phrases.concat(wordLists.keywords)
let pairings = wordLists.pairings;
let myArgs = process.argv.slice(2);

// Handle Command Line Args
switch (myArgs[0]) {
  case 'dev':
    timeToWait = 0;
    console.log("Running in Dev mode");
    break;
  default:
    console.log(`Sorry, I do not understand the command "${myArgs[0]}".`);
    process.exit();
}

function respondWithSpicyMeme(phrase, cb){
  if(!phrase){
    return
  }
  console.log("Responding with a spicy meme")
  var spicyMemeLink;
  giphy.search(phrase, function(err, res){
    if(err){
      return console.log(err);
    } else {
      cb(res.data[Math.floor(Math.random() * 6)].url);
    }
  });
}

bot.on("ready", async () => {
  console.log(`Bot is ready! ${bot.user.username}`);

  try {
      let link = await bot.generateInvite(["ADMINISTRATOR"]);
      console.log(link);
  } catch(e) {
      console.log(e.stack);
  };
});

function phraseFinder(sentence, collection, cb){
  for(var key in collection) {
    let result = cb(key)
    if(result) return result;
  }
}

function phraseIsFound(sentence){
    let result = phraseFinder(sentence, pairings, function(key){
                                                    return (sentence.indexOf(key) >= 0) ? pairings[key] : false
                                                  });
    return result ? result : phraseFinder(sentence, words, function(key){
                                                    return (sentence.indexOf(words[key]) >= 0) ? words[key] : false
                                                  });
}

function botCanSendMessage(message){
  let messengerIsNotBot = (message.author.username !== bot.user.username)
  let enoughTimeHasPassed = (new Date() - timeLastSuccessfulMessageWasSent > timeToWait)
  return  (messengerIsNotBot && enoughTimeHasPassed)
}

bot.on('message', message => {
  console.log(`Incoming Transmission: ${message.content}`)
    if(botCanSendMessage(message)) {
      respondWithSpicyMeme(phraseIsFound(message.content), function(url){
        message.reply(url);
        timeLastSuccessfulMessageWasSent = new Date();
      })
    }
});

bot.login(secret);
