const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const db = require("../../Schemas/Devas");

module.exports = {
  name: "blacklist",
  description: "Developer Command.",
  cooldown: "3000",
  options: [
    {
      name: "user",
      description: "Blacklist a user from using the bot.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "The user to blacklist.",
          type: "STRING",
          required: true,
        },
        {
          name: "reason",
          description: "The reason for blacklisting.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "server",
      description: "Blacklist a server from using the bot.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "The server to blacklist.",
          type: "STRING",
          required: true,
        },
        {
          name: "reason",
          description: "The reason for blacklisting.",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],

  async execute(client, interaction) {
    const i = interaction;
    if (!client.devs.includes(interaction.user.id))
      return await interaction.reply({
        embeds: [client.devOnly],
        ephemeral: true,
      });

    if (i.options.getSubcommand() === "user") {
      const user = i.options.getString("id");
      const reason = i.options.getString("reason");

      const blocked = new MessageEmbed()
        .setColor(client.color)
        .setDescription(
          `You're blacklisted from accessing bot anymore by the developer for violating bot's terms of use. You may request for a unblacklist in our **[Support Server](${client.server}), if** you think this could be a mistake. \n**Reason:** ${reason}`
        );

      await db.updateOne(
        { Blacklist: "Blacklist" },
        { $push: { UsersBlacklist: user } },
        { upsert: true }
      );
      await i.reply({
        content:
          client.emotes.ok +
          ` <@${user}> is now blacklisted from accessing bot.`,
      });
      await client.users.cache
        .get(user)
        .send({ embeds: [blocked] })
        .catch(() => {});
    }

    if (i.options.getSubcommand() === "server") {
      const guild = i.options.getString("id");
      const server = client.guilds.cache.get(guild);
      const reason = i.options.getString("reason");
      const blocked = new MessageEmbed()
        .setColor(client.color)
        .setDescription(
          `Your server **${server}** is blacklisted from accessing bot anymore by the developer for violating bot's terms of use. You may request for a unblacklist in our **[Support Server](${client.server}), if** you think this could be a mistake. \n**Reason:** ${reason}`
        );
      await db.updateOne(
        { Blacklist: "Blacklist" },
        { $push: { ServersBlacklist: server.id } },
        { upsert: true }
      );
      await i.reply({
        content: `**${server.name}** is now blacklisted from accessing bot.`,
      });
      await client.users.cache
        .get(server.ownerId)
        .send({ embeds: [blocked] })
        .catch(() => {});
    }
  },
};
