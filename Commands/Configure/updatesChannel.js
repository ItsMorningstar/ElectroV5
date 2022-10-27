const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "updates-channel",
  description:
    "Set a channel where the bot will send the info about latest updates.",
  permission: "MANAGE_WEBHOOKS",
  cooldown: "7000",
  options: [
    {
      name: "channel",
      description: "  Channel where bot should send updates.",
      type: "CHANNEL",
      required: false,
      channelTypes: ["GUILD_TEXT"],
    },
  ],

  async execute(client, interaction) {
    const channel = interaction.options.getChannel("channel") || interaction.channel;

    const ok = new MessageEmbed()
      .setColor(client.color)
        .setDescription(`${client.emotes.ok} ${channel} is now set as a Bot Updates Channel.`);

    client.channels.cache.get("838770720510836806").addFollower(channel, `${interaction.user.tag} Set the channel as a bot updates channel.`);
    await interaction.reply({ embeds: [ok] });
  },
};
