var Discord = require("discord.js");
var giphy = require("giphy-api")(process.env.GIPHY_SECRET);
var fs = require('fs');
var secret = process.env.DISCORD_SECRET;
var wordList = fs.readFileSync('keywords.csv', 'utf8').split(',');
var bot = new Discord.Client({disableEveryone: true});
var timeLastSuccessfulMessageWasSent = new Date();
var timeToWait = 120 * 1000; /* Seconds times 1000ms */


function respondWithSpicyMeme(keyword, cb){
  var spicyMemeLink;
  giphy.search(keyword, function(err, res){
    if(err){
      return console.log(err);
    } else {
      cb(res.data[Math.floor(Math.random() * 10)].url);
    }
  });
}



bot.on("ready", async function() {
  console.log(`Bot is ready! ${bot.user.username}`);

  try {
      let link = await bot.generateInvite(["ADMINISTRATOR"]);
      console.log(link);
  } catch(e) {
      console.log(e.stack);
  };
});

function keywordIsFound(sentence){
  var message_words = sentence.split(' ');
  for(var i = 0; i < message_words.length; i++){
    for(var j = 0; j < wordList.length; j++){
      if(message_words[i].toLowerCase() === wordList[j].toLowerCase()){
        return message_words[i];
      }
    }
  }
  return false;
}

bot.on('message', message => {
  if(message.author.username !== bot.user.username) {
    if((new Date() - timeLastSuccessfulMessageWasSent) > timeToWait) {
      keyWord = keywordIsFound(message.content);
      if(keyWord) {
        respondWithSpicyMeme(keyWord, function(url){
          message.reply(url);
          timeLastSuccessfulMessageWasSent = new Date();
        })
      }
    }
  }
});

bot.login(secret);
