const { MessageEmbed, Permissions } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "giveaway",
  description: "Create / Reroll / Cancel a Giveaway for server.",
  permission: "MANAGE_MESSAGES",
  cooldown: "7000",
  options: [
    {
      name: "create",
      description: "Create a new giveaway.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "time",
          description: "When should the giveaway end ?",
          type: "STRING",
          required: true,
        },
        {
          name: "winners",
          description: "How many people to be selected ?",
          type: "INTEGER",
          required: true,
        },
        {
          name: "prize",
          description: "What prize are you giving away ?",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "reroll",
      description: "Select another winner.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "ID of giveaway message by bot.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "end",
      description: "End a giveaway before time.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "ID of giveaway message by bot.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "cancel",
      description: "Cancel any existing giveaway.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "ID of giveaway message by bot.",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],

  async execute(client, interaction) {
    let giveawayDuration = interaction.options.getString("time");
    let giveawayNumberWinners = interaction.options.getInteger("winners");
    let winnerCount = giveawayNumberWinners;
    let prize =
      `${client.emotes.gift} ` +
      interaction.options.getString("prize") +
      ` ${client.emotes.gift}`;
    const messageId = interaction.options.getString("id");
    if (
      !interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
    )
      return await interaction.reply(client.missPermsEmbed);

    if (interaction.options.getSubcommand() === "create") {
      if (ms(giveawayDuration) > 1209600000 || ms(giveawayDuration) <= 0) {
        return await interaction.reply({
          content:
            client.emotes.no +
            " Please provide a valid time. \n(Tip: Premium needed for giveaways longer than 14 days)",
          ephemeral: true,
        });
      }

      if (
        parseInt(giveawayNumberWinners) <= 0 ||
        parseInt(giveawayNumberWinners) > 14
      ) {
        return await interaction.reply({
          content:
            client.emotes.no +
            " Please provide a valid number of winners. 1 - 14. \n(Tip: Premium needed for giveaways larger than 14 winners)",
          ephemeral: true,
        });
      }
      if (!prize.length > 21) {
        return await interaction.reply({
          content:
            client.emotes.no +
            " The length of prize must not be larger than 21 characters.",
          ephemeral: true,
        });
      }

      client.giveawaysManager
        .start(interaction.channel, {
          duration: ms(giveawayDuration),
          winnerCount,
          prize,
          hostedBy: interaction.user,
          messages: {
            giveaway:
              client.emotes.party +
              client.emotes.party +
              " **Giveaway** " +
              client.emotes.party +
              client.emotes.party,
            giveawayEnded:
              client.emotes.party +
              client.emotes.party +
              " **Giveaway Ended** " +
              client.emotes.party +
              client.emotes.party,
            drawing:
              "Ends: {timestamp} (<t:{Math.round(this.endAt / 1000)}:F>)",
            inviteToParticipate: `React with ${client.emotes.party} to participate!`,
            embedFooter: `{this.winnerCount} winner(s)`,
            winMessage: {
              content: "{winners}",
              embed: new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                  "Congratulations, {winners}! You won **{this.prize}**!\n[Giveaway ↗️]({this.messageURL})"
                ),
            },
          },
        })
        .catch((err) => {
          const embed = new MessageEmbed()
            .setColor("#bf000d")
            .setDescription(
              `${client.emotes.no} Oops...an error occured.\n\`${err}\``
            );

          interaction.reply({
            embed: [embed],
            ephemeral: true,
          });
        })
        .then(
          async () =>
            await interaction.reply({
              content: `Giveaway Created. ${client.emotes.ok}`,
              ephemeral: true,
            })
        );
    }

    if (interaction.options.getSubcommand() === "end") {
      const giveaway =
        client.giveawaysManager.giveaways.find(
          (g) =>
            g.guildId === interaction.guildId &&
            g.prize === interaction.options.getString("prize")
        ) ||
        client.giveawaysManager.giveaways.find(
          (g) =>
            g.guildId === interaction.guildId &&
            g.messageId === interaction.options.getString("id")
        );
      if (!giveaway) {
        return await interaction.reply({
          content: client.emotes.no + " No giveaway found with provided ID.",
          ephemeral: true,
        });
      }

      client.giveawaysManager
        .end(messageId, {
          messages: {
            content: client.emotes.loading,
            congrat: {
              embed: new MessageEmbed()
                .setColor("#b00000")
                .setDescription(`${interaction.user} Ended the giveaway!`),
              replyToGiveaway: true,
            },
          },
        })
        .catch((err) => {
          const embed = new MessageEmbed()
            .setColor("#bf000d")
            .setDescription(
              `${client.emotes.no} Oops...an error occured.\n\`${err}\``
            );

          interaction.reply({
            embed: [embed],
            ephemeral: true,
          });
        })
        .then(
          async () =>
            await interaction.reply({
              content: `Giveaway Ended. ${client.emotes.ok}`,
              ephemeral: true,
            })
        );
    }

    if (interaction.options.getSubcommand() === "reroll") {
      const giveaway =
        client.giveawaysManager.giveaways.find(
          (g) =>
            g.guildId === interaction.guildId &&
            g.prize === interaction.options.getString("prize")
        ) ||
        client.giveawaysManager.giveaways.find(
          (g) =>
            g.guildId === interaction.guildId &&
            g.messageId === interaction.options.getString("id")
        );
      if (!giveaway) {
        return await interaction.reply({
          content: client.emotes.no + " No giveaway found with provided ID.",
        });
      }

      client.giveawaysManager
        .reroll(messageId, {
          messages: {
            content: "{winners}",
            congrat: {
              embed: new MessageEmbed()
                .setColor("#00ccff")
                .setDescription(
                  client.emotes.party +
                    " New winner(s): {winners}!\n Congratulations, you won **{this.prize}**! [Giveaway]({this.messageURL})"
                ),
              replyToGiveaway: true,
            },
            error: {
              embed: new MessageEmbed()
                .setColor("#b00000")
                .setDescription(
                  client.emotes.no +
                    " No valid participations, no new winner(s) can be chosen!"
                ),
              replyToGiveaway: true,
            },
          },
        })
        .catch((err) => {
          const embed = new MessageEmbed()
            .setColor("#bf000d")
            .setDescription(
              `${client.emotes.no} Oops...an error occured.\n\`${err}\``
            );

          interaction.reply({
            embed: [embed],
            ephemeral: true,
          });
        })
        .then(
          async () =>
            await interaction.reply({
              content: `Giveaway Rerolled. ${client.emotes.ok}`,
              ephemeral: true,
            })
        );
    }

    if (interaction.options.getSubcommand() === "cancel") {
      const giveaway =
        client.giveawaysManager.giveaways.find(
          (g) =>
            g.guildId === interaction.guildId &&
            g.prize === interaction.options.getString("prize")
        ) ||
        client.giveawaysManager.giveaways.find(
          (g) =>
            g.guildId === interaction.guildId &&
            g.messageId === interaction.options.getString("id")
        );
      if (!giveaway) {
        return await interaction.reply({
          content: client.emotes.no + " No giveaway found with provided ID.",
          ephemeral: true,
        });
      }
      try {
        client.giveawaysManager.delete(messageId).then(
          async () =>
            await interaction.reply({
              content:
                client.emotes.ok +
                ` The giveaway was cancelled by ${interaction.user}.`,
            })
        );
      } catch (err) {
        const embed = new MessageEmbed()
          .setColor("#bf000d")
          .setDescription(
            `${client.emotes.no} Oops...an error occured.\n\`${err}\``
          );

        interaction
          .reply({
            embed: [embed],
            ephemeral: true,
          })
          .then(
            async () =>
              await interaction.reply({
                content: `Giveaway Cancelled. ${client.emotes.ok}`,
                ephemeral: true,
              })
          );
      }
    }
  },
};
