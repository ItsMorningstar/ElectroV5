const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "purge",
  description: "Delete a number of messages in a channel.",
  permission: "MANAGE_MESSAGES",
  cooldown: "3000",
  options: [
    {
      name: "messages",
      description: "Number of messages to delete.",
      type: "INTEGER",
      required: true,
    },
    {
      name: "user",
      description: "If specified, only messages by this user will be deleted.",
      type: "USER",
      required: false,
    },
  ],

async execute(client, interaction) {

    const member = interaction.options.getUser("user");
    const message_count = interaction.options.getInteger("messages");

    if (message_count == 0 || message_count > 100)
      return interaction.reply({
        content: `${client.emotes.no} Only 100 Messages can be purged at once.`,
        ephemeral: true,
      });
    if (member) {
      let AllMessages = await interaction.channel.messages.fetch();
      let FilteredMessages = await AllMessages.filter(
        (x) => x.author.id === member.id
      );
      let deletedMessages = 0;
      FilteredMessages.forEach((msg) => {
        if (deletedMessages >= message_count) return;
        msg.delete();
        deletedMessages++;
      });
    } else {
      await interaction.channel
        .bulkDelete(
          (await interaction.channel.messages.fetch({ limit: message_count })).filter((m) => !m.pinned))
        .catch((error) => interaction.reply("❌ " + error));
    }

    const purgeSuccess = new MessageEmbed()

      .setDescription(`${client.emotes.ok} **Successfully, Purged ${message_count} Message(s).**`)
      .setColor(client.color);
    await interaction
      .reply({
        embeds: [purgeSuccess],
        epheremal: false,
      })
      .catch((error) => interaction.reply("❌ " + error));
  },
};
