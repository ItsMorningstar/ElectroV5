const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    name: "unmute",
    description: "Timeout a member a member for a specified amount of time.",
    permission: "MODERATE_MEMBERS",
    cooldown: "3000",
    options: [
          {
            name: "user",
            description: "The member to be un-timed out.",
            type: "USER",
            required: true,
          },
          {
            name: "reason",
            description: "The reason of unmuting.",
            type: "STRING",
            required: false,
          }
    ],
  
    async execute(client, interaction) {

        const target = interaction.guild.members.cache.get(interaction.options.getMember('user').id);
        const r = interaction.options.getString('reason') || "No reason specified.";
        const reason = `By ${interaction.user.tag}: ` + r;

        if(target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: client.emotes.no + ' That User is on same or higher role than yours.', ephemeral: true})
        if(target.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.reply({content: client.emotes.no + ' That User is on a higher role than mine, Please Drag up the `Electro` Role.', ephemeral: true})
        if (reason.length >77) return interaction.reply({content: client.emotes.no + 'The reason specified must be less then 77 characters.', ephemeral: true})
    await target.timeout(null, "Command By: " + interaction.user.tag);

    const success = new MessageEmbed()
    .setDescription(`${client.emotes.ok} ${target} is now unmuted.` +  "\n\n`Moderator:` " + `<@${interaction.user.id}>`).setColor(client.color)
    interaction.reply({ embeds: [success]})
    
    .catch((error) => interaction.reply('❌ ' + error))

    },
};