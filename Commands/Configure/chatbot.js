const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    name: "chat-ai",
    description: "Feeling lonely? Well ok, chat with me. :>",
    permission: "MANAGE_CHANNELS",
    cooldown: "7000",
    options: [
      {
        name: "channel",
        description: "  Channel where bot should respond to messages.",
        type: "CHANNEL",
        required: true,
        channelTypes: ["GUILD_TEXT"],
      },
    ],
  
  async execute(client, interaction) {

    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return await interaction.reply(client.missPermsEmbed);
    const channel = interaction.options.getChannel('channel').id;

    const guildModel = require("../../Schemas/Guilds");
    guildModel.updateOne({guildId: interaction.guild.id}, {aiChannel: channel})
    .catch((error) => console.log('❌ ' + error));
    
    const ok = new MessageEmbed().setColor(client.color).setDescription(client.emotes.ok + ' <#' + channel + '> is now set as a AI Chat Channel.')
    await interaction.reply({
        embeds: [ok]
    })
    }
};