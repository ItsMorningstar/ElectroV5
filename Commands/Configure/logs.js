const { MessageEmbed, Permissions, Constants } = require("discord.js");

module.exports = {
  name: "log-messages",
  description:
    "Log all the deleted messages of server in a channel for moderation purposes.",
  permission: "MANAGE_CHANNELS",
  cooldown: "7000",
  options: [
    {
      name: "channel",
      description: "The channel where messages should be logged.",
      type: "CHANNEL",
      required: true,
      channelTypes: ["GUILD_TEXT"],
    },
  ],

  async execute(client, interaction) {
    const channel = interaction.options.getChannel("channel").id;
    if (!channel.type == "text")
      return await interaction.reply({
        content: `${client.emotes.no} Only a text channel can be logs channel.`,
      });

    if (
      !interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)
    )
      return await interaction.reply(client.missPermsEmbed);

    const guildModel = require("../../Schemas/Guilds");
    guildModel
      .updateOne({ guildId: interaction.guild.id }, { logChannel: channel })
      .catch((error) => console.log("❌ " + error));

    const ok = new MessageEmbed()
      .setColor(client.color)
      .setDescription(
        client.emotes.ok +
          " <#" +
          channel +
          "> is now set as a Message Logs Channel."
      );
    await interaction.reply({
      embeds: [ok],
    });
  },
};
