const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

const db = require("../../Schemas/Tickets");
const setupData = require("../../Schemas/Guilds");

module.exports = {
  name: "ticket",
  description: "Electro Ticket System.",
  permission: "MANAGE_CHANNELS",
  cooldown: "7000",
  options: [
    {
      name: "setup",
      description: "Setup the ticket system.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "category",
          description:
            "Set a category for tickets and bot will automatically setup channels for you.",
          type: "CHANNEL",
          required: true,
          channelType: ["GUILD_CATEGORY"],
        },
        {
          name: "staff",
          description: "Set the role which should be allowed to view tickets.",
          type: "ROLE",
          required: true,
        },
        {
          name: "transcripts",
          description:
            "Configure if the transcripts should be saved for tickets closed.",
          type: "BOOLEAN",
          required: true,
        },
        {
          name: "description",
          description: "Configure a custom description for ticket panel.",
          type: "STRING",
          required: false,
        },
      ],
    },

    {
      name: "add-remove",
      description: "Add / Remove member to ticket.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "action",
          description: "Want to add member or remove ?",
          type: "STRING",
          required: true,
         choices: [{name: "Add", value: "add"}, {name: "Remove", value: "remove"}],
        },
        {
          name: "user",
          description: "The user you want to add or remove.",
          type: "USER",
          required: true,
        },
      ],
    },

    {
      name: "claim",
      description: "Claim the ticket.",
      type: "SUB_COMMAND",
    },

    {
      name: "rename",
      description: "Rename the ticket.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "name",
          description: "New name for ticket.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "close",
      description: "Close the ticket.",
      type: "SUB_COMMAND",
    },
  ],

  async execute(client, interaction) {
    const reason = `Command By: ${interaction.user.tag}`;
    const ET = "https://imgur.com/PU5GbED.png";

    if (interaction.options.getSubcommand() === "setup") {
      try {
        const { guild } = interaction;
        const category = interaction.options.getChannel("category").id;
        const staff = interaction.options.getRole("staff").id;
        const trans = interaction.options.getBoolean("transcripts");
        const panel = await guild.channels.create(`・tickets`, {
          type: "GUILD_TEXT",
          parent: category,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
              deny: ["SEND_MESSAGES"],
            },
          ],
          reason,
        });

        await setupData.updateOne(
          { guildId: guild.id },
          {
            ticketSetup: {
              channel: panel.id,
              category: category,
              handlers: staff,
            },
          },
          {
            upsert: true,
          }
        );

        const desc =
          interaction.options.getString("description") ||
          "React below to create a ticket.";

        const embed = new MessageEmbed()
          .setColor(client.color)
          .setAuthor({
            name: `${guild.name}`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setThumbnail(ET)
          .setTitle("Tickets Panel")
          .setImage("https://imgur.com/hwcT2Es.png")
          .setDescription(`${client.emotes.dot} ${desc}`);

        const Panel = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("open")
            .setEmoji("<:Tickets:955863469566079016>")
            .setStyle("SUCCESS")
        );
        await client.channels.cache
          .get(panel.id)
          .send({ embeds: [embed], components: [Panel] })
          .catch((error) => console.log("❌ " + error));

        await interaction.reply({
          content: client.emotes.ok + " Alright, Ticket Setup complete.",
          ephemeral: true,
        });

        if (trans) {
          const trans = await guild.channels.create(`・ticket-transcripts`, {
            type: "GUILD_TEXT",
            parent: category,
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
              },
              {
                id: staff,
                allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
              },
            ],
            reason,
          });

          await setupData.updateOne(
            { guildId: guild.id },
            {
              ticketSetup: {
                channel: panel.id,
                category: category,
                transcripts: trans.id,
                handlers: staff,
              },
            },
            { upsert: true }
          );
          const tembed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(
              "The channel is now set for transcripts of tickets, Visible to Staff role & Adminstrators only.\n**We do not store any of this data with us.**"
            );

          await client.channels.cache
            .get(trans.id)
            .send({ embeds: [tembed] })
            .catch((error) => console.log("❌ " + error));
        }
      } catch (error) {
        console.log("❌ " + error);
      }
    }

    const notTicket = new MessageEmbed()
      .setColor(client.color)
      .setDescription(client.emotes.no + " This channel is not a ticket.");

    if (interaction.options.getSubcommand() === "add-remove") {
      const { guild, options, channel } = interaction;
      const action = options.getString("action");
      const member = options.getUser("member");

      switch (action) {
        case "add":
          db.findOne(
            { guildID: guild.id, channelID: channel.id },
            async (err, docs) => {
              if (err) throw err;
              if (!docs)
                return interaction.reply({
                  embeds: [notTicket],
                  ephemeral: true,
                });

              channel.permissionOverwrites.edit(
                member.id,
                {
                  VIEW_CHANNEL: true,
                  SEND_MESSAGES: true,
                  READ_MESSAGE_HISTORY: true,
                },
                [reason]
              );

              await interaction.reply({
                embeds: [
                  embed.setDescription(
                    client.emotes.ok +
                      `${member} has been **added** to this ticket.`
                  ),
                ],
              });
              docs.save();
            }
          );
          break;
        case "remove":
          db.findOne(
            { guildID: guild.id, channelID: channel.id },
            async (err, docs) => {
              if (err) throw err;
              if (!docs)
                return interaction.reply({
                  embeds: [notTicket],
                  ephemeral: true,
                });

              channel.permissionOverwrites.edit(
                member.id,
                { VIEW_CHANNEL: false },
                [reason]
              );

              await interaction.reply({
                embeds: [
                  embed.setDescription(
                    client.emotes.ok +
                      `${member} has been **removed** from this ticket.`
                  ),
                ],
              });
              docs.save();
            }
          );
      }
    }

    if (interaction.options.getSubcommand() === "rename") {
      const { guild, options, channel, member } = interaction;
      const data = await setupData.findOne({ guildId: guild.id });

      await db
        .findOne({ channelID: channel.id }, async (err, docs) => {
          if (err) throw err;
          if (!docs)
            return interaction.reply({
              embeds: [notTicket],
              ephemeral: true,
            });

          if (
            !member.permissions.has("ADMINISTRATOR") &&
            !member.roles.cache.has(data.ticketSetup.handlers)
          )
            return interaction.reply({
              content: `${client.emotes.no} Only Staff & Administrators are allowed to claim tickets.`,
              ephemeral: true,
            });

          const name = options.getString("name");
          if (name.length > 14)
            return await interaction.reply({
              content:
                client.emotes.no +
                " The name of ticket must be less then 14 characters.",
              ephemeral: true,
            });
          await channel.setName(name, reason);
          await interaction.reply({
            content: client.emotes.ok + " Successfully, renamed this ticket.",
          });
        })
        .clone();
    }

    if (interaction.options.getSubcommand() === "claim") {
      const { guild, channel, member } = interaction;
      const data = await setupData.findOne({ guildId: guild.id });

      await db
        .findOne({ channelID: channel.id }, async (err, docs) => {
          if (err) throw err;
          if (!docs)
            return interaction.reply({
              embeds: [notTicket],
              ephemeral: true,
            });

          if (
            !member.roles.cache.has(data.ticketSetup.handlers) &&
            !member.permissions.has("ADMINISTRATOR")
          )
            return interaction.reply({
              content: `${client.emotes.no} Only Staff & Administrators are allowed to claim tickets.`,
              ephemeral: true,
            });

          if (!docs) return;
          if (docs.claimedBy)
            return interaction.reply({
              content:
                client.emotes.no +
                ` This ticket is already claimed by <@${docs.claimedBy}>.`,
              ephemeral: true,
            });

          await db.updateOne(
            { channelID: channel.id },
            { claimedBy: member.id }
          );
          const claimedEmbed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(
              `${client.emotes.dot} This ticket has now been claimed by ${interaction.member}.`
            );
          await interaction.reply({ embeds: [claimedEmbed] });
        })
        .clone();
    }

    if (interaction.options.getSubcommand() === "close") {
      const { guild, channel, member } = interaction;
      const data = await setupData.findOne({ guildId: guild.id });
      const { createTranscript } = require("discord-html-transcripts");

      if (
        !member.permissions.has("ADMINISTRATOR") &&
        !member.roles.cache.has(data.ticketSetup.handlers)
      )
        return await interaction.reply({
          content:
            client.emotes.no + " Only staff are allowed to close tickets.",
          ephemeral: true,
        });

      await db
        .findOne({ channelID: channel.id }, async (err, docs) => {
          const embed = new MessageEmbed().setColor(client.color);
          if (err) throw err;
          if (!docs)
            return interaction.reply({
              embeds: [notTicket],
              ephemeral: true,
            });
          await db.deleteOne({ channelID: channel.id });

          if (data.ticketSetup.transcripts) {
            const attachment = await createTranscript(channel, {
              limit: -1,
              returnBuffer: false,
              fileName: `${docs.memberID}.html`,
            });
            const o = new MessageEmbed()
              .setColor(client.color)
              .setTitle("Ticket Closed")
              .setThumbnail(ET)
              .setTimestamp()
              .setDescription(
                `**Member:** <@${docs.memberID}>\n **Closed By:** <@${interaction.user.id}>`
              );

            const message = await client.channels.cache
              .get(data.ticketSetup.transcripts)
              .send({
                embeds: [o],
                files: [attachment],
              });
            const k = new MessageEmbed()
              .setTitle("Ticket Closed")
              .setColor(client.color)
              .setDescription(
                `The transcript is now saved [View](${message.url})`
              );

            await interaction.reply({ embeds: [k] });
          }

          const ok = new MessageEmbed()
            .setTitle("Ticket Closed")
            .setColor(client.color)
            .setDescription(
              `The ticket has been closed by <@${interaction.user.id}>`
            );

          await interaction.channel.send({ embeds: [ok] });
          setTimeout(() => {
            channel.delete();
          }, 10 * 1000);
        })
        .clone();
    }
  },
};
