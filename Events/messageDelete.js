const { MessageEmbed } = require("discord.js");
const guildModel = require("../Schemas/Guilds");

module.exports = {
  name: "messageDelete",
  async execute(client, message) {

    if (message.author.id == client.user.id) return
    const guild = await guildModel.findOne({guildId: message.guild.id});
    if (!guild) return;
    const deleteLogsChannel = client.channels.cache.get(guild.logChannel);
    
    if (deleteLogsChannel) {

      const DeleteLog = new MessageEmbed().setColor(client.color).setTimestamp()

        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL()})
        .setDescription(`**Message sent by ${message.author} deleted in ${message.channel}** \n ${message.content}`)
        .setThumbnail(message.attachments.first() ? message.attachments.first().proxyURL : null)
        .setFooter({
          text: `Author: ${message.author.id} | Message ID: ${message.id}`
        })
      await deleteLogsChannel.send({embeds: [DeleteLog]}).catch((e) => console.log(e.string))
    }
  }
}