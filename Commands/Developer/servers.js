const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "servers",
  description: "Developer Command.",
  cooldown: "7000",
  async execute(client, interaction) {
    if (!client.devs.includes(interaction.user.id))
      return await interaction.reply({
        embeds: [client.devOnly],
        ephemeral: true,
      });

    let i0 = 0;
    let i1 = 10;
    let page = 1;

    let description =
      `Total Servers - ${client.guilds.cache.size}\n\n` +
      client.guilds.cache
        .sort((a, b) => b.memberCount - a.memberCount)
        .map((r) => r)
        .map(
          (r, i) =>
            `**${i + 1}.** **${r.name}** \n **Members:** ${
              r.memberCount
            } \n**ID:** ${r.id} \n`
        )
        .slice(0, 10)
        .join("\n");

    let embed = new MessageEmbed()

      .setColor(client.color)
      .setTitle(`Page - ${page}/${Math.ceil(client.guilds.cache.size / 7)}`)
      .setDescription(description);


      let msg = await interaction.reply({ embeds: [embed], fetchReply:true})
      await msg.react("⬅️");
      await msg.react("➡️");

    let collector = msg.createReactionCollector((user) => user.id === interaction.user.id, { time: 21000 });

    collector.on("collect", async (reaction, user) => {
      
      if (reaction._emoji.name === "⬅️") {
        // Updates variables
        i0 = i0 - 10;
        i1 = i1 - 10;
        page = page - 1;

        // if there is no guild to display, delete the message
        if (i0 + 1 < 0) {
          console.log(i0);
        }
        if (!i0 || !i1) {
        }

        description =
          `Total Servers - ${client.guilds.cache.size}\n\n` +
          client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((r) => r)
            .map(
              (r, i) =>
                `**${i + 1}.** **${r.name}** \n **Members:** ${
                  r.memberCount
                } \n**ID:** ${r.id} \n`
            )
            .slice(i0, i1)
            .join("\n");

        // Update the embed with new informations
        embed
          .setTitle(
            `Page - ${page}/${Math.round(client.guilds.cache.size / 10 + 1)}`
          )
          .setDescription(description);

        // Edit the message
        msg.edit({ embeds: [embed] });
      }

      if (reaction._emoji.name === "➡️") {
        // Updates variables
        i0 = i0 + 10;
        i1 = i1 + 10;
        page = page + 1;

        // if there is no guild to display, delete the message
        if (i1 > client.guilds.cache.size + 10) {
        }
        if (!i0 || !i1) {
        }

        description =
          `Total Servers - ${client.guilds.cache.size}\n\n` +
          client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((r) => r)
            .map(
              (r, i) =>
                `**${i + 1}.** **${r.name}** \n **Members:** ${
                  r.memberCount
                } \n**ID:** ${r.id} \n`
            )
            .slice(i0, i1)
            .join("\n");

        // Update the embed with new informations
        embed
          .setTitle(
            `Page - ${page}/${Math.round(client.guilds.cache.size / 10 + 1)}`
          )
          .setDescription(description);

        // Edit the message
        msg.edit({ embeds: [embed] });
      }

      // Remove the reaction when the user react to the message
      await reaction.users.remove(interaction.user.id);
    });
  },
};
