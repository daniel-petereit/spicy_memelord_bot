var Discord = require("discord.js");
var secret = process.env.DISCORD_SECRET;

var bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
  console.log(`Bot is ready! ${bot.user.username}`);

  try {
      let link = await bot.generateInvite(["ADMINISTRATOR"]);
      console.log(link);
  } catch(e) {
      console.log(e.stack);
  }
});


bot.on('message', message => {
  if(message.content.toLowerCase() === 'wassauf buddy') {
    message.reply('wassauf mein hund');
  }
});

bot.login(secret);
