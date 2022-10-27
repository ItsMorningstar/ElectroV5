const { Permissions, MessageEmbed, Constants } = require("discord.js");

module.exports = {
  name: "lock",
  description: "Locks a channel OR category for @everyone.",
  permission: "MANAGE_CHANNELS",
  cooldown: "5000",
  options: [
    {
      name: "channel",
      description: "The channel / category to be locked.",
      type: "CHANNEL",
      required: false,
      channelTypes: ["GUILD_TEXT", "GUILD_CATEGORY"],
    },
  ],

  async execute(client, interaction) {
    const channels =
      interaction.options.getChannel("channel") || interaction.channel;
      
    await channels.permissionOverwrites.edit(
      interaction.guild.id,
      { SEND_MESSAGES: false },
      `Channels Locked by ${interaction.user.tag}`
    );

    await interaction.reply({
      content: `Alright, ${channels} is now locked. ${client.emotes.ok}`,
    });
  },
};