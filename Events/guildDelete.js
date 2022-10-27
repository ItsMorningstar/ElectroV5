const { MessageEmbed } = require("discord.js");
const { serversChannel } = require("../config.json");

module.exports = {
  name: "guildDelete",
  async execute(client, guild) {
    const removed = new MessageEmbed().setColor(client.color).setTitle("Removed").setDescription(`**Name:** ${guild.name} [${guild.id}]\n**Owner:** <@${guild.ownerId}> [${guild.ownerId}]\n**Members:** ${guild.memberCount}`);
    client.channels.cache.get(serversChannel).send({embeds: [removed]});

const guildModel = require("../Schemas/Guilds");
await guildModel.deleteOne({guildId: guild.id});
  }
}
