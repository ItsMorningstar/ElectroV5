const { MessageEmbed,MessageActionRow,MessageButton,Permissions } = require("discord.js");
const { cmdChannel, errChannel } = require("../config.json");
const { createTranscript } = require("discord-html-transcripts");
const CooldownsDB = require("../Schemas/Cooldowns");
const ticketData = require("../Schemas/Tickets");
const guildData = require("../Schemas/Guilds");
const devasData = require("../Schemas/Devas");
const userData = require("../Schemas/Users");

module.exports = {
  name: "interactionCreate",

  async execute(client, interaction) {
    const { guildId, guild } = interaction;
    if (interaction.isCommand()) {
      if (interaction.user.bot) return;
      const Blacklist = await devasData.findOne({ Blacklist: "Blacklist" });
      if (Blacklist) {
        if (Blacklist.UsersBlacklist.includes(interaction.user.id)) return;
        if (Blacklist.ServersBlacklist.includes(interaction.guild.id)) return;
      }

      const command = client.commands.get(interaction.commandName);
      const user = interaction.guild.members.cache.get(interaction.user.id);
      if (command.permission) {
        const noPerms = new MessageEmbed()
          .setColor(client.color)
          .setDescription(
            `${client.emotes.no} You don't have the permissions to execute the command.`
          );
        const permless = new MessageEmbed()
          .setColor(client.color)
          .setDescription(
            client.emotes.no +
              " I Don't have the necessary permissions to execute the action.\nIt's recommended to allow me the `Administrator` Permission for smooth functioning."
          );
        if (command.permission) {
          if (!interaction.guild.me.permissions.has(Permissions.FLAGS[command.permission]))
            return interaction.reply({ embeds: [permless], ephemeral: true });
          if (!user.permissions.has(Permissions.FLAGS[command.permission]))
            return interaction.reply({ embeds: [noPerms], ephemeral: true });
        }
      }

      if (!command)
        return (
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor(client.color)
                .setDescription(client.emotes.no),
            ],
            ephemeral: true,
          }) && client.commands.delete(interaction.commandName)
        );
      // CHECK FOR COOLDOWNS COMMAND //
      const cmd = client.commands.get(interaction.commandName);

      if (cmd) {
        const CommandName = cmd.name.replace(" ", "").toLowerCase();

        if (cmd.cooldown) {
          const Data = await CooldownsDB.findOne({
            Details: `${guildId}||${CommandName}||${user.id}`,
          });

          if (!Data && user.id != guild.ownerId) {
            await CooldownsDB.create({
              Details: `${guildId}||${CommandName}||${user.id}`,
              Time: Date.now() + cmd.cooldown,
            });
          }

          if (client.cooldowns.has(`${guildId}||${CommandName}||${user.id}`))
            return;

          if (user.id != guild.ownerId || !client.devs.includes(user.id)) {
            client.cooldowns.set(
              `${guildId}||${CommandName}||${user.id}`,
              Date.now() + cmd.cooldown
            );
          }

          setTimeout(async () => {
            client.cooldowns.delete(`${guildId}||${CommandName}||${user.id}`);
            await CooldownsDB.findOneAndDelete({
              Details: `${guildId}||${CommandName}||${user.id}`,
            });
          }, cmd.cooldown);
        }
      }
      try {
        await command.execute(client, interaction);
        const embed = new MessageEmbed()
          .setColor(client.color)
          .setTitle(interaction.commandName)
          .setDescription(
            "**Server:** " +
            interaction.guild.name +
            `\` [${interaction.guild.id}]\`` +
            "\n**User:** " +
            interaction.user.tag +
            `\` [${interaction.user.id}]\``
          );
        client.channels.cache.get(cmdChannel).send({ embeds: [embed] });

        const buttons = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("1")
            .setEmoji("1️⃣")
            .setStyle("PRIMARY"),
          new MessageButton()
            .setCustomId("2")
            .setEmoji("2️⃣")
            .setStyle("PRIMARY"),
          new MessageButton()
            .setCustomId("3")
            .setEmoji("3️⃣")
            .setStyle("PRIMARY"),
          new MessageButton()
            .setCustomId("4")
            .setEmoji("4️⃣")
            .setStyle("PRIMARY"),
        );
        
    const collector = interaction.channel.createMessageComponentCollector({ time: 5 * 3600 * 1000 });
    collector.on("collect", async (i) => {
      i.deferUpdate();
      if (i.customId == "1") {
        await userData.updateOne({ Id: interaction.user.id }, { poll: 1 }, { upsert: true });
      }
      if (i.customId == "2") {
        await userData.updateOne({ Id: interaction.user.id }, { poll: 2 }, { upsert: true });
      }
      if (i.customId == "3") {
        await userData.updateOne({ Id: interaction.user.id }, { poll: 3 }, { upsert: true });
      }
      if (i.customId == "4") {
        await userData.updateOne({ Id: interaction.user.id }, { poll: 4 }, { upsert: true });
      }
    });
        const poll = new MessageEmbed().setColor(client.color)
          .setTitle(`Which icon do you think is best for the next major version of Electro?`)
          .setDescription("Choose from:")
          .setImage("https://media.discordapp.net/attachments/953733633045319691/1032594598268244058/vote.png");

        await .send({ embeds: [poll], components: [buttons] });
        
        const wait = require("util").promisify(setTimeout);
        if (interaction.customId === "select") {
          await interaction.deferUpdate();
          await wait(2000);
          await interaction.editReply({
            content: "ok",
            ephemeral: false,
            components: [row],
          });
        }
      } catch (err) {
        console.error("❌ " + err);
        await client.channels.cache
          .get(errChannel)
          .send({ content: "``` ❌" + err + "```" });
      }
    }

    // Ticket System ---------------------------------------------------------

    if (interaction.isButton()) {
      const reason = `Command By: ${interaction.user.tag}`;
      const ET = "https://imgur.com/PU5GbED.png";

      if (interaction.customId == "open") {
        const { guild, member } = interaction;

        await ticketData
          .findOne({ guildID: guild.id }, async (err, docs) => {
            if (docs) {
              if (docs.memberID == member.id)
                return await interaction.reply({
                  content:
                    client.emotes.no + ` You already have a ticket open.`,
                  ephemeral: true,
                });
            }
            const data = await guildData.findOne({ guildId: guild.id });
            await guild.channels
              .create(`${"Ticket-" + member.user.tag}`, {
                type: "GUILD_TEXT",
                parent: data.ticketSetup.category,
                permissionOverwrites: [
                  {
                    id: member.id,
                    allow: [
                      "SEND_MESSAGES",
                      "VIEW_CHANNEL",
                      "READ_MESSAGE_HISTORY",
                    ],
                  },
                  {
                    id: data.guildId,
                    deny: [
                      "SEND_MESSAGES",
                      "VIEW_CHANNEL",
                      "READ_MESSAGE_HISTORY",
                    ],
                  },
                  {
                    id: data.ticketSetup.handlers,
                    allow: [
                      "SEND_MESSAGES",
                      "VIEW_CHANNEL",
                      "READ_MESSAGE_HISTORY",
                    ],
                  },
                ],
                reason,
              })
              .then(async (channel) => {
                await ticketData.create({
                  guildID: guild.id,
                  memberID: member.id,
                  channelID: channel.id,
                });
                const embed = new MessageEmbed()
                  .setColor(client.color)
                  .setTitle(`Ticket: ${member.user.tag}`)
                  .setThumbnail(ET)
                  .setDescription(
                    "Please wait patiently for a response from Staff team, meanwhile describe the issue."
                  );

                const Buttons = new MessageActionRow().addComponents(
                  new MessageButton()
                    .setStyle("PRIMARY")
                    .setCustomId("claim")
                    .setEmoji("📫")
                    .setLabel("Claim"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("close")
                    .setEmoji("🔒")
                    .setLabel("Close")
                );
                await channel.send({
                  content: `<@${member.id}>`,
                  embeds: [embed],
                  components: [Buttons],
                });

                await interaction.reply({
                  content: `Your Ticket is successfully created <#${channel.id}>`,
                  ephemeral: true,
                });
              });
          })
          .clone();
      }

      if (interaction.customId == "close") {
        const { guild, channel, member } = interaction;
        const data = await guildData.findOne({ guildId: guild.id });

        if (
          !member.permissions.has("ADMINISTRATOR") &&
          !member.roles.cache.has(data.ticketSetup.handlers)
        )
          return await interaction.reply({
            content:
              client.emotes.no + " Only staff are allowed to close tickets.",
            ephemeral: true,
          });

        await ticketData
          .findOne({ channelID: channel.id }, async (err, docs) => {
            const embed = new MessageEmbed().setColor(client.color);
            if (err) throw err;
            if (!docs)
              return await interaction.reply({
                embeds: [
                  embed.setDescription(
                    client.emotes.no +
                      `Ticket Data not found, please delete manually.`
                  ),
                ],
                ephemeral: true,
              });
            await ticketData.deleteOne({ channelID: channel.id });

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

      if (interaction.customId == "claim") {
        const { guild, channel, member } = interaction;
        const data = await guildData.findOne({ guildId: guild.id });
        if (
          !member.roles.cache.has(data.ticketSetup.handlers) &&
          !member.permissions.has("ADMINISTRATOR")
        )
          return interaction.reply({
            content:
              client.emotes.no +
              " Only Staff & Administrators are allowed to claim tickets.",
            ephemeral: true,
          });

        await ticketData
          .findOne({ channelID: channel.id }, async (err, docs) => {
            if (!docs) return;
            if (docs.claimedBy)
              return interaction.reply({
                content:
                  client.emotes.no +
                  ` This ticket is already claimed by <@${docs.claimedBy}>.`,
                ephemeral: true,
              });

            await ticketData.updateOne(
              { channelID: channel.id },
              { claimedBy: member.id }
            );
            const claimedEmbed = new MessageEmbed()
              .setColor(client.color)
              .setDescription(
                client.emotes.dot +
                  ` This ticket has now been claimed by ${interaction.member}.`
              );
            await interaction.reply({ embeds: [claimedEmbed] });
          })
          .clone();
      }

      // Reaction Roles ---------------------------------------------------------
      const { guild, member } = interaction;
      const reasonR = "Electro Reaction Roles";

      if (guild.roles.cache.get(interaction.customId)) {
        if (!member.roles.cache.has(interaction.customId)) {
          await member.roles.add(interaction.customId, [reasonR]);
          await interaction.reply({
            content: "<:ElectroThumbsUp:955863471289942026> Role Added.",
            ephemeral: true,
          });
        } else {
          await member.roles.remove(interaction.customId, [reasonR]);
          await interaction.reply({
            content: "<:ElectroThumbsUp:955863471289942026> Role Removed.",
            ephemeral: true,
          });
        }
      }
    }
    if (interaction.isSelectMenu()) {
      const { member } = interaction;
      const reasonR = "Electro Reaction Roles";

      if (interaction.customId == "rr") {
        if (!member.roles.cache.has(interaction.values[0])) {
          await member.roles.add(interaction.values[0], [reasonR]);
          await interaction.reply({
            content: "<:ElectroThumbsUp:955863471289942026> Role Added.",
            ephemeral: true,
          });
        } else {
          await member.roles.remove(interaction.values[0]);
          await interaction.reply({
            content: "<:ElectroThumbsUp:955863471289942026> Role Removed.",
            ephemeral: true,
          });
        }
      }
    }
  },
};
