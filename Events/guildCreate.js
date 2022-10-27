const { MessageEmbed } = require("discord.js");
const { serversChannel } = require("../config.json");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
// No stop coming to this again n again this for new guilds setting go do in handleCommnads first
module.exports = {
  name: "guildCreate",

  async execute(client, guild) {
    CommandsArray = [];

    (await PG(`${process.cwd()}/Commands/**/*.js`)).map(async (file) => {
      const command = require(file);

      client.commands.set(command.name, command);
      CommandsArray.push(command);
    });

    await guild.commands.set(CommandsArray);

    // Log The Servers

    const added = new MessageEmbed()
      .setColor(client.color)
      .setTitle("Added")
      .setDescription(
        `**Name:** ${guild.name} [${guild.id}]\n**Owner:** <@${guild.ownerId}> [${guild.ownerId}]\n**Members:** ${guild.memberCount}`
      );
    await client.channels.cache
      .get(serversChannel)
      .send({ embeds: [added] })
      .catch(() => {});
    const guildModel = require("../Schemas/Guilds");
    new guildModel({ guildId: guild.id }).save();
  },
};
