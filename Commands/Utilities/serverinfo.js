const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Get information about the server.",
  cooldown: "7000",

  async execute(client, interaction) {
    const level = interaction.guild.verificationLevel;
    let embed = new MessageEmbed()
      .addFields(
        {
          name: "Members",
          value: `
          <:ServerPopulation:955863464511930509> **Total:** ${
            interaction.guild.memberCount
          }
          ${client.emotes.memberCount} **Humans:** ${
            interaction.guild.members.cache.filter((member) => !member.user.bot)
              .size
          }
          <:EarlyVerifiedBotDev:955863462142173244> **Bots:** ${
            interaction.guild.members.cache.filter((x) => x.user.bot).size
          }
`,
          inline: true,
        },

        {
          name: "Channels",
          value: `
          <:ElectroMessages:955863454839885874>  **Total:** ${
            interaction.guild.channels.cache.filter(
              (c) => c.type !== "category"
            ).size
          }
          <:TextChannel:955863460825153557>  **Texts:** ${
            interaction.guild.channels.cache.filter(
              (c) => c.type === "GUILD_TEXT"
            ).size
          }
          <:ElectroVoiceChannel:955863455569690714> **Voice:** ${
            interaction.guild.channels.cache.filter(
              (c) => c.type === "GUILD_VOICE"
            ).size
          }
          <:ElectroRoles:955863463354327070>  **Roles:** ${interaction.guild.roles.cache.size}
`,
          inline: true,
        },
        {
          name: " ‍",
          value: ` ‍`,
          inline: false,
        },

        {
          name: "<a:ServerUtility:955863474175635548> Statistics",
          value: ` ‍ 
${client.emotes.dot} **\`Server Owner:\`** <@${interaction.guild.ownerId}>

${client.emotes.dot} **\`Verification Level:\`** ${
            level[0] + level.substring(1).toLowerCase()
          }

${client.emotes.dot} **\`Vanity:\`** discord.gg/${
            interaction.guild.vanityURLCode || " "
          }
\n ‍`,
          inline: true,
        },

        {
  name: "<a:Boost:838482437529010190> Nitro Stats",
  value: ` ‍ 
${client.emotes.dot} **\`Boost Level:\`** ${interaction.guild.premiumTier.replace("TIER_", "")}

${client.emotes.dot} **\`Boosters:\`** ${interaction.guild.members.cache.filter((m) => m.premiumSince).size}

${client.emotes.dot} **\`Boosts:\`** ${interaction.guild.premiumSubscriptionCount}
`, inline: true,
        }
      )

      .setColor(client.color)
      .setTimestamp()
      .setTitle(
        interaction.guild.name,
        interaction.guild.iconURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setThumbnail(
        interaction.guild.iconURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setImage(
        interaction.guild.bannerURL({
          size: 1024,
        })
      );
    interaction.reply({
      embeds: [embed],
    });
  },
};
