const {
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

module.exports = {
  name: "webhooks-delete",
  description: "Delete all webhooks from the server.",
  permission: "MANAGE_WEBHOOKS",
  cooldown: "7000",
  channelTypes: ["GUILD_TEXT", "GUILD_CATEGORY"],

  async execute(client, interaction) {
    const deleteSuccess = new MessageEmbed()
      .setDescription(
        client.emotes.ok +
          ` ${interaction.user} Successfully, deleted all Webhook(s) from the server.`
      )
      .setColor(client.color);
    const whitelisted = ["932935684010942494", "945972857039634433", "945985304349782046"]; // ID's of webhook not to delete;

    const yesNo = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("yes")
        .setLabel("Yes ✅")
        .setStyle("SUCCESS"),

      new MessageButton().setCustomId("no").setLabel("No ❌").setStyle("DANGER")
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

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 7000,
    });
    await interaction.reply({
      content:
        "**Are you sure, you want to delete all webhook(s) from this server ?**",
      components: [yesNo],
    });
    collector.on("collect", async (i) => {
      if (i.customId === "yes") {
        await i.deferUpdate();
        await interaction.guild
          .fetchWebhooks()
          .then((hook) =>
            hook
              .filter((h) => !whitelisted.includes(h.id))
              .forEach((h) => h.delete())
          );
        await i.editReply({
          embeds: [deleteSuccess],
          components: [No],
        });
      }

      if (i.customId === "no") {
        await i.deferUpdate();
        await i.editReply({
          content: client.emotes.ok + " Alright, No webhook(s) were removed.",
          components: [No],
        });
      }
    });
  },
};
