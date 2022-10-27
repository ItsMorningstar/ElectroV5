const { MessageActionRow, MessageEmbed, MessageButton, MessageSelectMenu } = require("discord.js");

module.exports = {
  name: "reaction-roles",
  description: "Embed reaction roles in a channel.",
  permission: "MANAGE_ROLES",
  cooldown: "7000",
  options: [
    {
      name: "title",
      description: "Title of the embed.",
      type: "STRING",
      required: true,
    },
    {
      name: "role-1",
      description: "Mention the role you want to make reaction role for.",
      type: "ROLE",
      required: true,
    },
    {
      name: "role-2",
      description: "Mention the role you want to make reaction role for.",
      type: "ROLE",
      required: false,
    },
    {
      name: "role-3",
      description: "Mention the role you want to make reaction role for.",
      type: "ROLE",
      required: false,
    },
    {
      name: "role-4",
      description: "Mention the role you want to make reaction role for.",
      type: "ROLE",
      required: false,
    },
    {
      name: "role-5",
      description: "Mention the role you want to make reaction role for.",
      type: "ROLE",
      required: false,
    },
    {
      name: "role-6",
      description: "Mention the role you want to make reaction role for.",
      type: "ROLE",
      required: false,
    },
    {
      name: "role-7",
      description: "Mention the role you want to make reaction role for.",
      type: "ROLE",
      required: false,
    },
  ],

  async execute(client, interaction) {
    const embed = new MessageEmbed().setColor(client.color);
    const filter = (msg) => msg.author.id == interaction.user.id;
    const title = interaction.options.getString("title");

    const perms = [
      "ADMINISTRATOR",
      "MANAGE_GUILD",
      "MANAGE_WEBHOOKS",
      "MANAGE_CHANNELS",
      "MANAGE_ROLES",
      "MANAGE_MESSAGES",
      "MENTION_EVERYONE",
      "MANAGE_EMOJIS_AND_STICKERS",
      "KICK_MEMBERS",
      "BAN_MEMBERS",
      "MODERATE_MEMBERS",
    ];

    const role1 = interaction.options.getRole("role-1");
    const role2 = interaction.options.getRole("role-2");
    const role3 = interaction.options.getRole("role-3");
    const role4 = interaction.options.getRole("role-4");
    const role5 = interaction.options.getRole("role-5");
    const role6 = interaction.options.getRole("role-6");
    const role7 = interaction.options.getRole("role-7");
    const no = `${client.emotes.no} One of the mentioned roles have **Mod Permissions** / is managed by discord.`;

    if (role1.permissions.has(perms) || role1.managed)
      return await interaction.reply({
        content: no,
        ephemeral: true,
      });
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("rr")
        .setPlaceholder("Select & take your roles.")
        .addOptions([
          {
            label: role1.name,
            value: role1.id,
          },
        ])
    );
    if (role2) {
      if (role2.permissions.has(perms) || role2.managed || role2.id == role1.id)
        return await interaction.reply({
          content: no,
          ephemeral: true,
        });
      row.components[0].addOptions([
        {
          label: role2.name,
          value: role2.id,
        },
      ]);
    }
    if (role3) {
      if (role3.permissions.has(perms) || role3.managed || role3.id == role2.id)
        return await interaction.reply({
          content: no,
          ephemeral: true,
        });

        row.components[0].addOptions([
        {
          label: role3.name,
          value: role3.id,
        },
      ]);
    }
    if (role4) {
      if (role4.permissions.has(perms) || role4.managed || role4.id == role3.id)
        return await interaction.reply({
          content: no,
          ephemeral: true,
        });

        row.components[0].addOptions([
        {
          label: role4.name,
          value: role4.id,
        },
      ]);
    }
    if (role5) {
      if (role5.permissions.has(perms) || role5.managed || role5.id == role4.id)
        return await interaction.reply({
          content: no,
          ephemeral: true,
        });

        row.components[0].addOptions([
        {
          label: role5.name,
          value: role5.id,
        },
      ]);
    }
    if (role6) {
      if (role6.permissions.has(perms) || role6.managed || role6.id == role5.id)
        return await interaction.reply({
          content: no,
          ephemeral: true,
        });

        row.components[0].addOptions([
        {
          label: role6.name,
          value: role6.id,
        },
      ]);
    }
    if (role7) {
      if (role7.permissions.has(perms) || role7.managed || role7.id == role6.id)
        return await interaction.reply({
          content: no,
          ephemeral: true,
        });
        row.components[0].addOptions([
        {
          label: role7.name,
          value: role7.id,
        },
      ]);
    }

    if (title.length > 210)
      return await interaction.reply({
        content: `${client.emotes.no} + Length of Title must not be longer then 210 Characters.`,
        ephemeral: true,
      });
    await embed.setTitle(title);

    await interaction.reply({
      content: "`Please send a description for the embed.`",
      ephemeral: true,
    });
    const collector = await interaction.channel.awaitMessages({
      filter,
      max: 1,
      time: 21000,
    });
    if (collector.first()) {

    const description = collector.first().content;

    if (description.length > 4000)
      return await collector.reply({
        content: `${client.emotes.no} + Length of description must not be longer then 4000 Characters.`,
        ephemeral: true,
      });

    await embed.setDescription(description);
    await interaction.channel
      .send({ embeds: [embed], components: [row] })
      .then(async (x) => {
        await x.reply({ content: `By: <@${interaction.user.id}>` });
      });
    } else return interaction.channel.send("ReactionRole Timed out. Be quicker next time.");
  },
};
