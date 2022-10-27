require("dotenv").config();
const Discord = require("discord.js");
const intents = new Discord.Intents(34337);
const client = new Discord.Client({
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
  intents,
});
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

require("./functions/handleEvents")(client);

client.login(process.env.token);