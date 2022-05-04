const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const hold = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription(
      "Shows all the commands on Moderation Man (or some info on a specific one)!"
    )
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("A command to show the info of")
        .setRequired(false)
    ),
  config: {
    timeout: ms("30s"),
    message: "You shouldn't just spam this information in your server.",
  },
  async execute(interaction) {
    await interaction.deferReply();
    var command = interaction.options.getString("command") || null;
    var color_array = [
      "#1DA619",
      "#192CA6",
      "#D4E10F",
      "#D51616",
      "#D5A116",
      "#8716D5",
      "#00FFFB",
      "#8BFF8D",
      "#7289DA",
    ];
    var random_color =
      color_array[Math.floor(Math.random() * color_array.length)];
    if (!command) {
      const help_embed = new MessageEmbed()
        .setColor(random_color)
        .setTitle(`${client.user.username} Commands!`)
        .setDescription(
          `Hello <@${interaction.user.id}>, here are all my commands!`
        )
        .setThumbnail(
          interaction.user.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: 512,
          })
        )
        .setFooter("Want more info? Run /help with a command!")
        .setURL(`https://${config.website.origin}`);
      const sending_embed = new MessageEmbed()
        .setColor(colors.yellow)
        .setDescription(`Trying to send you a DM...`);
      const sent_embed = new MessageEmbed()
        .setColor(colors.green)
        .setDescription(
          `All of my commands were sent to your DMs!`
        );
      for (var [id, cmd] of client.commands) {
        help_embed.addField(
          `${cmd.data.name}`,
          `Description: ${cmd.data.description}`,
          true
        );
      }
      var website_link = `https://${config.website.origin}`;
      var support_link = "https://discord.gg/496ceneFjA";
      var github_link = "https://github.com/Yoshiboi18303/Ultron-Bot";
      const link_row = new MessageActionRow().addComponents(
        new MessageButton()
          .setStyle("LINK")
          .setLabel("Website")
          .setURL(website_link),
        /* .setDisabled(true) */ new MessageButton()
          .setStyle("LINK")
          .setLabel("Support Server")
          .setURL(support_link),
        new MessageButton()
          .setStyle("LINK")
          .setLabel("GitHub Repository")
          .setURL(github_link)
      );
      await interaction.editReply({
        embeds: [sending_embed],
        ephemeral: true,
      });
      await hold(4500);
      try {
        await interaction.user.send({
          embeds: [help_embed],
          components: [link_row],
        });
        await interaction.editReply({
          embeds: [sent_embed],
          ephemeral: true,
        });
      } catch (e) {
        const failed_embed = new MessageEmbed()
          .setColor(colors.red)
          .setDescription(
            `I can't send you a DM, do you want to get the raw embed instead?\n\n**You have 1 minute to select an option.**`
          );
        var re_row = new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("YES")
            .setCustomId("raw-embed-yes")
            .setEmoji("✅"),
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel("NO")
            .setCustomId("raw-embed-no")
            .setEmoji("❌")
        );
        await interaction.editReply({
          embeds: [failed_embed],
          components: [re_row],
          ephemeral: true,
        });

        const filter = (btnInt) => {
          return interaction.user.id == btnInt.user.id;
        };

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          max: 1,
          time: 1000 * 60,
        });

        collector.on("end", async (collection) => {
          if (collection.first()?.customId == "raw-embed-yes") {
            const getting_embed = new MessageEmbed()
              .setColor(colors.orange)
              .setDescription(`Okay, fetching the raw embed...`);
            re_row = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SUCCESS")
                .setLabel("YES")
                .setCustomId("raw-embed-yes")
                .setEmoji("✅")
                .setDisabled(true),
              new MessageButton()
                .setStyle("SECONDARY")
                .setLabel("NO")
                .setCustomId("raw-embed-no")
                .setEmoji("❌")
                .setDisabled(true)
            );
            await collection.first()?.update({
              embeds: [getting_embed],
              components: [re_row],
              ephemeral: true,
            });
            await hold(1750);
            await collection.first()?.editReply({
              embeds: [help_embed],
              components: [link_row],
              ephemeral: true,
            });
          } else if (collection.first()?.customId == "raw-embed-no") {
            await collection.first()?.update({
              content:
                "Okay then! If you want to get the embed in DMs, just turn on your direct messages from server members.\n`User Settings > Privacy & Safety > Allow direct messages from server members (update this for all servers) OR Server > Dropdown > Privacy Settings > Allow direct messages from server members.`\n\n**You also could've had the bot blocked on Discord, please check for that as well.**",
              embeds: [],
              components: [],
              ephemeral: true,
            });
          } else {
            await collection.first()?.update({
              content: "You didn't respond in time.",
              embeds: [],
              components: [],
              ephemeral: true,
            });
          }
        });
      }
    } else {
      /*
      if(interaction.guild.id != config.bot.testServerId) return await interaction.editReply({ content: `This part of the help command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!`, ephemeral: true })
      */
      var lower_cmd = command.toLowerCase();
      var cmd = client.commands.get(lower_cmd);
      if (cmd == undefined || typeof cmd == "undefined") {
        const bad_cmd_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("No Command Found")
          .setDescription(
            `There was no command found for **${lower_cmd}**.${
              lower_cmd.includes("/")
                ? " \n\n**Tip: Don't include the `/` for a slash command.**"
                : ""
            }`
          );
        return await interaction.editReply({
          embeds: [bad_cmd_embed],
        });
      } else {
        var data = cmd.data;
        const returnCommandOptions = () => {
          var options = [];
          if (data.options) {
            for (var option of data.options) {
              if (option.required) {
                options.push(`\`<${option.name}>\``);
              } else {
                options.push(`\`[${option.name}]\``);
              }
            }
          }
          return options.join(" ");
        };
        const cmd_help_embed = new MessageEmbed()
          .setColor(interaction.member.displayHexColor)
          .setTitle(
            `Help On ${data.name.replace(
              data.name[0],
              data.name[0].toUpperCase()
            )}`
          )
          .addFields([
            {
              name: "Command Name",
              value: `${data.name}`,
              inline: true,
            },
            {
              name: "Command Description",
              value: `${data.description}`,
              inline: true,
            },
            {
              name: "Usage",
              value: `${
                data.options.length <= 0 ? `\`/${data.name}\`` : `/${data.name}`
              } ${returnCommandOptions()}`,
              inline: true,
            },
          ])
          .setFooter(`Syntax: <> = required, [] = optional`);
        await interaction.editReply({
          embeds: [cmd_help_embed],
        });
      }
    }
  },
};