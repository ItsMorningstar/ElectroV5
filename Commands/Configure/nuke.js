const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  name: "nuke",
  description: "Delete & Recreate the channel.",
  permission: "MANAGE_CHANNELS",
  cooldown: "7000",

  async execute(client, interaction) {
    const nuked = new MessageEmbed()
      .setColor(client.color)
      .setDescription(
        `${client.emotes.ok} ` + `**${interaction.user}** Nuked This Channel !`
      )
      .setTimestamp()
      .setImage(
        "https://media1.tenor.com/images/9a25530561ab9c94637e9f6c63f53812/tenor.gif"
      );

    const yesNo = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("yes")
        .setLabel("Yes")
        .setStyle("SUCCESS"),

      new MessageButton().setCustomId("no").setLabel("No").setStyle("DANGER")
    );
    const No = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("yes")
        .setLabel("Yes")
        .setStyle("SECONDARY")
        .setDisabled(true),

      new MessageButton()
        .setCustomId("no")
        .setLabel("No")
        .setStyle("DANGER")
        .setDisabled(true)
    );
    await interaction.reply({
      content: "Are you sure, you want to nuke this channel ?",
      components: [yesNo],
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 7000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "yes") {
        await i.deferUpdate();
          await interaction.channel
            .clone({
              reason: `The channel was nuked by  ${interaction.user.tag}`,
            })
            .then((c) => c
                .setParent(interaction.channel.parent?.id || null)
                .then(() => c.send({ embeds: [nuked] }))
            )
        
          await interaction.channel
            .delete({
              reason: `The channel was nuked by  ${interaction.user.tag}`,
            })
            .catch(() => {});
        }

      if (i.customId === "no") {
        await i.deferUpdate();
        await i.editReply({
          content:
            client.emotes.ok + " Alright, Nuke was destroyed in air itself!",
          components: [No],
        });
      }
    });
    collector.on("end", async (collected) => {
      try {
        await interaction.editReply({
          components: [No],
        });
      } catch (e) {
        return;
      }
    });
  },
};
