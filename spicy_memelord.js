var Discord = require("discord.js");
var fs = require('fs');
var secret = process.env.DISCORD_SECRET;
var wordList = fs.readFileSync('keywords.csv', 'utf8').split(',');
var bot = new Discord.Client({disableEveryone: true});


bot.on("ready", async () => {
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
        return true;
      }
    }
  }
  return false;
}

bot.on('message', message => {
  if(keywordIsFound(message.content)) {
    message.reply('Found the keyword!');
  }
});

bot.login(secret);
