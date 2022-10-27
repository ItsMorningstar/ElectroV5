const { UserFlags } = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "whois",
  description: "Get information about yourself or a user.",
  cooldown: "7000",
  options: [
    {
      name: "user",
      description: "The user you want to get information about.",
      type: "USER",
      required: false,
    },
  ],

  async execute(client, interaction) {
    
    const user = interaction.options.getUser("user");
    let mentionedMember;
    if (user) {
      mentionedMember = interaction.guild.members.cache.get(user.id);
    }
    if (!user) {
      mentionedMember = interaction.guild.members.cache.get(
        interaction.user.id
      );
    }
    const roles = mentionedMember.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1);

    let displayRoles;

    if (roles.length < 10) {
      displayRoles = roles.join(" ");
      if (roles.length < 1) displayRoles = "No Roles...";
    } else {
      displayRoles = roles.join(" ");
    }
    let dev;
    if (
      mentionedMember.user.flags.has(
        UserFlags.FLAGS.EARLY_VERIFIED_BOT_DEVELOPER
      )
    ) {
      dev = " <:EarlyVerifiedBotDev:955863462142173244>";
    } else {
      dev = " ";
    }
    let partner;
    if (
      mentionedMember.user.flags.has(UserFlags.FLAGS.PARTNERED_SERVER_OWNER)
    ) {
      partner = " <a:DiscordPartner:955863477900169216>";
    } else {
      partner = " ";
    }
    let booster;
    if (mentionedMember.premiumSince) {
      booster = " <a:ElectroBoost:955863459621388298>";
    } else {
      booster = " ";
    }
    const statusEmojis = {
      dnd: "<:DND:955863453317353522>",
      idle: "<:Idle:955863458430201857>",
      online: "<:Online:955863466214846464>",
      offline: "<:Offline:955863462578388993>",
    };
    const houseEmojis = {
      HOUSE_BRAVERY: " <:HypeSquadBravery:930781714710687744>",
      HOUSE_BALANCE: " <:HypeSquadBalance:930781747224928256>",
      HOUSE_BRILLIANCE: " <:HypeSquadBrilliance:930781771262476308>",
    };
    const status = statusEmojis[mentionedMember.presence?.status] || "~";
    const houses = mentionedMember.user.flags
      .toArray()
      .map((house) => houseEmojis[house]);
    const userEmbed = new MessageEmbed()
      .setTitle(`${mentionedMember.user.username}`)
      .setDescription(`<@${mentionedMember.id}>`)
      .setThumbnail(
        mentionedMember.user.displayAvatarURL({ format: "png", dynamic: true })
      )
      .setColor(client.color)

      .addFields(
        {
          name: "Registered:",
          value: `<t:${parseInt(
            mentionedMember.user.createdTimestamp / 1000
          )}:R>`,
          inline: true,
        },
        {
          name: "Joined:",
          value: `<t:${parseInt(mentionedMember.joinedTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: `Roles: [${roles.length}]`,
          value: `~ ${displayRoles}`,
          inline: false,
        },
        {
          name: `Key Permissions:`,
          value: `${mentionedMember.permissions
            .toArray()
            .map((e) => e.split("_").join(" "))
            .map((e) => e.toLowerCase())
            .map((e) => {
              e = e.split(" ");
              let ok = [];
              e.forEach((element) => {
                ok.push(
                  element[0].toUpperCase() + element.slice(1, element.length)
                );
              });
              return ok.join(" ");
            })
            .slice(0, 15)
            .join(", ")}`,
          inline: false,
        },
        {
          name: "Status",
          value: `${status}ㅤ`,
          inline: true,
        },
        {
          name: "Badges",
          value: `${houses + dev + partner + booster}ㅤ`,
          inline: true,
        },

      );
    await interaction.reply({ embeds: [userEmbed] });
  },
};
