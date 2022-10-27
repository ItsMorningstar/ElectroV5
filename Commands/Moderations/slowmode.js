const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "slowmode",
  description: "Set slowmode for @everyone in a channel.",
  permission: "MANAGE_MESSAGES",
  cooldown: "3000",
  options: [
    {
      name: "duration",
      description: "Duration of slowmode.",
      type: "STRING",
      required: true,
    },
  ],

async execute(client, interaction) {

    const time = ms(interaction.options.getString("duration"))/1000;


    if (time < 0 || time > 21600)
      return interaction.reply({
        content:
          client.emotes.no + " Slowmode time must be between `1 sec - 6 hours`",
        ephemeral: true,
      });

    await interaction.channel.setRateLimitPerUser(time, [ `Commanded By ${interaction.user.tag}` ]);
    const slowmodeSuccess = new MessageEmbed().setColor(client.color)
      .setDescription(`${client.emotes.ok} ${interaction.channel} is now activated with **${time} Secs** Slowmode.`)

    interaction.reply({ embeds: [slowmodeSuccess] })
    .catch((error) => interaction.reply("❌ " + error));

  },
};
