var wordLists = require("./keywords.js")
var Discord = require("discord.js");
var giphy = require("giphy-api")(process.env.GIPHY_SECRET);
var secret = process.env.DISCORD_SECRET;
var bot = new Discord.Client({disableEveryone: true});
var timeLastSuccessfulMessageWasSent = new Date();
var timeToWait = 120 * 1000; /* Seconds times 1000ms */


var words = wordLists.phrases.concat(wordLists.keywords)

function respondWithSpicyMeme(phrase, cb){
  console.log("Responding with a spicy meme")
  var spicyMemeLink;
  giphy.search(phrase, function(err, res){
    if(err){
      return console.log(err);
    } else {
      cb(res.data[Math.floor(Math.random() * 10)].url);
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

function phraseIsFound(sentence){
  for(var key in words) {
    if(sentence.indexOf(words[key]) >= 0){
      console.log("Found Phrase:")
      console.log(words[key])
      return words[key]
    }
  }
  return false;
}

bot.on('message', message => {
  console.log(message.content)
  if(message.author.username !== bot.user.username) {
    if((new Date() - timeLastSuccessfulMessageWasSent) > timeToWait) {
      phrase = phraseIsFound(message.content);
      if(phrase) {
        respondWithSpicyMeme(phrase, function(url){
          message.reply(url);
          timeLastSuccessfulMessageWasSent = new Date();
        })
      }
    }
  }
});

bot.login(secret);
