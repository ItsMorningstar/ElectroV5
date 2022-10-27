const {Permissions, MessageEmbed, Constants} = require("discord.js");

module.exports = {
  name: "unlock",
  description: "Unlocks a channel OR the category for @everyone.",
  permission: "MANAGE_CHANNELS",
  cooldown: "5000",
  options: [
    {
      name: "channel",
      description: "The channel / category to be unlocked.",
      type: "CHANNEL",
      required: false,
      channelTypes: ["GUILD_TEXT", "GUILD_CATEGORY"],
    },
  ],

async execute(client, interaction) {

    const channels = interaction.options.getChannel("channel") || interaction.channel;
      
    await channels.permissionOverwrites.edit(
      interaction.guild.id,
      { SEND_MESSAGES: true },
      `Channels Locked by ${interaction.user.tag}`
    );
    await interaction.reply({
      content: `Alright, ${channels} is now unlocked. ${client.emotes.ok}`,
    });
  },
};