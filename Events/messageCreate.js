const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const axios = require("axios");
const guildModel = require("../Schemas/Guilds");

module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    if (message.author.bot) return;
    if (message.channel.type !== "GUILD_TEXT") return;
    
    // AI-CHAT --------------------------------------------------------------------------------
    const guild = await guildModel.findOne({ guildId: message.guild.id });
    const chatchannel = await client.channels.cache.get(guild.aiChannel);
    if (!guild) return;
    if (!chatchannel) return;
    if (!message) return;
    if (!message.content) return;
    if (!message.content.toString) return;
    if (!message.channel.type == "GUILD_TEXT") return;
    if (!message.channel.id == chatchannel) return;
    if (message.channel.id == chatchannel) {
      if (message.author.bot) return;
      await message.channel.setRateLimitPerUser("3", [
        `Channel is set as a AI-Chat channel.`,
      ]);

      const msg = encodeURIComponent(message).toString();
      let res = await axios
        .get(`https://api.popcat.xyz/chatbot?msg=${msg}&owner=Yoo_ItsMaster&botname=Electro`)
        .catch(() => {});

      if (res && res.data && res.data.response) {
        await message.reply(
          res.data.response
            .replace("Udit", "! YoIts𝕄𝕒𝕤𝕥𝕖𝕣#7777")
            .replace("Pop cat", "! YoIts𝕄𝕒𝕤𝕥𝕖𝕣#7777")
            .replace("Yoo_ItsMaster", "@Yoo_ItsMaster")
            .replace("udit@udit.gq", "support@electrobot.xyz")
            .replace("Popcatcoding@gmail.com", "support@electrobot.xyz")
            .replace("San Francisco", "Uttar Pradesh")
            .replace("United States", "India")
            .replace("Julia Roberts", "Kriti Sanon")
            .replace("Beta", client.version)
            .replace("Imagine By The Beatles", "Sooraj Dooba Hain")
            .replace("Christian", "Hinduism")
            .replace("Request Timed Out", "Sleeping... <a:ElectroSleep:955863480311906354>")
            .replace(`Innkeeper: "The room is $15 a night. It's $5 if you make your own bed." Guest: "I'll make my own bed." Innkeeper: "Good. I'll get you some nails and wood."`, "'You are intellegent!' <:PeepoBuisnessBlush:947893255574532159>")
        );
      } else {
        ress = await axios
          .get(`https://api.affiliateplus.xyz/api/chatbot?message=${msg}&botname=Electro&ownername=Yoo_ItsMaster&age=2&gender=male&location=India&president=Ram Nath Kovind&religion=Hinduism&favoriteactor=Sushant Sing Rajput&favoriteactress=Kriti Sanon&favoritemovie=Chichhore&favoritesong=Sooraj Dooba Hain&physicallocation=India&birthplace=https://electrobot.xyz&build=Electro ${client.version}&celebrity=Akshay Kumar&favoritecolor=blue&class=7&email=support@electrobot.xyz&version=${client.version}`)
          .catch(() => {});

        if (ress && ress.data) {
          await message
            .reply({
              content: ress.data.message,
            })
            .catch(() => {});
        } else {
          await message.reply({
            content: "Sleeping... <a:ElectroSleep:955863480311906354>",
          });
        }
      }
    }

    // Slash commands shift -----------------------------------------------------------------------
    if (
      message.content == "<@931583578314268672>" ||
      message.content == "<@!931583578314268672>"
    ) {
      const slash = new MessageEmbed()
        .setColor(client.color)
        .setDescription(
          "**Yo There,**\n**Electro is now using Slash Commands!** Use `/help`\n\nDon't see the slash commands ? Please check out  **FAQ** for knowing about the case.\nhttps://docs.electrobot.xyz/faq\n\nIf you continue facing problems, consider asking for help in our support server."
        );

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setURL(client.server)
          .setLabel("Support Server")
          .setStyle("LINK"),
        new MessageButton()
          .setURL("https://docs.electrobot.xyz/faq")
          .setLabel("FAQ")
          .setStyle("LINK")
      );
      await message.reply({ embeds: [slash], components: [row] });
    }

  
  // // Evaluate --------------------------------------------------------------------------------
  // let args = message.content.slice("=".length).trim().split(/ +/g);
  // const cmd = args.shift().toLowerCase();
  // if (cmd == "eval") {
  //   if (!client.devs.includes(message.author.id)) return;

  //   const embed = new MessageEmbed().addField(
  //     "Input",
  //     "```js\n" + args.join(" ") + "```"
  //   );

  //   try {
  //     const code = args.join(" ");
  //     if (!code)
  //       return await message.reply({
  //         embeds: [{ title: "What To Evaluate ?", color: "#1900ff" }],
  //       });
  //     let evaled = eval(code);

  //     if (typeof evaled !== "string")
  //       evaled = require("util").inspect(evaled, { depth: 0 });

  //     let output = clean(evaled);
  //     embed
  //       .addField("Result", "```js\n" + output + "```")
  //       .setColor(`#4efc03`);

  //     await message.reply({ embeds: [embed] });
  //   } catch (error) {
  //     let err = clean(error);
  //     embed.addField("Error", "```js\n" + err + "```").setColor(`#ff0019`);

  //     await message.reply({ embeds: [embed] });
  //   }
  //   function clean(string) {
  //     if (typeof text === "string") {
  //       return string
  //         .replace(/`/g, "`" + String.fromCharCode(8203))
  //         .replace(/@/g, "@" + String.fromCharCode(8203));
  //     } else {
  //       return string;
  //     }
  //   }
  // }
  },
};
