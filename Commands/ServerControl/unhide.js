const {Permissions, MessageEmbed, Constants} = require("discord.js");

module.exports = {
  name: "unhide",
  description: "Unhide a hidden channel OR the category for @everyone.",
  permission: "MANAGE_CHANNELS",
  cooldown: "5000",
  options: [
    {
      name: "channel",
      description: "The channel / category to be unprivated.",
      type: "CHANNEL",
      required: false,
      channelTypes: ["GUILD_TEXT", "GUILD_CATEGORY"],
    },
  ],

async execute(client, interaction) {

    const channels = interaction.options.getChannel("channel") || interaction.channel;
      
    await channels.permissionOverwrites.edit(
      interaction.guild.id,
      { VIEW_CHANNEL: true },
      `Channels Locked by ${interaction.user.tag}`
    );
    await interaction.reply({
      content: `Alright, ${channels} is now unprivated. ${client.emotes.ok}`,
    });
  },
};