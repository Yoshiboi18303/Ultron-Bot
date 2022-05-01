const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Permissions,
  Interaction,
  Client,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.isCommand()) {
      if (!interaction.guild)
        return await interaction.reply({
          content: "You need to run these commands in a guild!",
          ephemeral: true,
        });
      if (interaction.user.bot) return;
      const command = client.commands.get(interaction.commandName);
      const channel = await client.channels.cache.get("964485796377788448");

      /*
      if(typeof command.config.guildOnly != "undefined" && command.config.guildOnly) {
        if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `**${command.data.name}** is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for right now!` })
      }
      */

      global.hexColor = interaction.member.displayHexColor;

      if (!command) return;

      /*
      if(!interaction.member.roles.cache.has(interaction.guild.roles.cache.get('900922312935735336'))) {
        if(interaction.replied || interaction.deferred) {
          return await interaction.editReply({ content: `You don't have the ${interaction.guild.roles.cache.get('900922312935735336').name} role! Which means you can't access the commands on this bot!\n\nView the info on this role with \`/roleinfo\`!`, ephemeral: true })
        } else {
          return await interaction.reply({ content: `You don't have the ${interaction.guild.roles.cache.get('900922312935735336').name} role! Which means you can't access the commands on this bot!`, ephemeral: true })
        }
      }
      */

      /*
      Users.findOne({ id: interaction.user.id }, async (err, data) => {
        if (err) throw err;
        if (!data) {
          console.log("Inserting a new document...");
          data = new Users({ id: interaction.user.id });
          data.save();
          console.log("Document inserted! Waiting until next command usage!");
        } else {
          cmds_used = data.commandsUsed;
          var bl = data.blacklisted;
          console.log("Updating a document...");
          if (bl || bl === true) {
            const blacklisted_embed = new MessageEmbed()
              .setColor(colors.red)
              .setTitle("Error")
              .setDescription(
                `You are blacklisted from using **${client.user.username}**!`
              );
            return await interaction.reply({
              embeds: [blacklisted_embed],
            });
          }
        */
      try {
        await command.execute(interaction);
      } catch (e) {
        new CommandError(
          `Whoopies! An error occured while trying to execute ${command.data.name}!\n\n`,
          e
        );
        const error_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            `An error occurred trying to execute **${command.data.name}** in **${interaction.guild.name}**...\n\n\`\`\`js\n${e}\n\`\`\``
          );
        await channel.send({
          content: `<@&904429332582240266>`,
          embeds: [error_embed],
        });
        const sent_err_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle(`Error Occurred! ${emojis.warn}`)
          .setDescription(`\`${e}\``)
          .addFields([
            {
              name: "Command",
              value: `${command.data.name}`,
            },
            {
              name: "Server",
              value: `${interaction.guild.name}`,
            },
          ])
          .setFooter(
            `This error was also sent to ${
              client.guilds.cache.get("833671287381032970").name
            }!`
          );
        var options = {
          embeds: [sent_err_embed],
          ephemeral: true,
        };
        if (interaction.replied || interaction.deferred) {
          return interaction.editReply(options);
        } else {
          return interaction.reply(options);
        }
      }
      // });
      console.log(
        `${"Trying to execute command".yellow} ${
          `${interaction.commandName}`.blue
        }${"...".yellow}`
      );
      const trying_embed = new MessageEmbed()
        .setColor(colors.yellow)
        .setTitle("Command Attempt")
        .setDescription(
          `Trying to execute command "**${interaction.commandName}**" in **${interaction.guild.name}**\n\nInteraction User: **${interaction.user.username}**\nInteraction Channel: <#${interaction.channel.id}>`
        );
      await channel.send({
        embeds: [trying_embed],
      });
      client.stats.postCommand(command.data.name, interaction.user.id);
      var msg =
        command.config != undefined || typeof command.config != "undefined"
          ? command.config.message
          : "Calm it down, you're gonna break something!";
      var timeout =
        command.config != undefined || typeof command.config != "undefined"
          ? command.config.timeout
          : ms("3s");
      /*
      if(commandsUsedRecently.has(interaction.user.id)) {
        var titles = ["Too spicy for me, take a breather", "429, Too many requests", "You need to slow down", "Way too fast for me"]
        const timeout_embed = new MessageEmbed()
          .setColor(colors.yellow)
          .setTitle(`${titles[Math.floor(Math.random() * titles.length)]}`)
          .setDescription(`${msg}`)
        return await interaction.reply({
          embeds: [timeout_embed]
        })
      } else {
      */
      /*
        commandsUsedRecently.add(interaction.user.id)
        setTimeout(() => commandsUsedRecently.delete(interaction.user.id), timeout)
      */
      // }
    } else {
      return;
    }
  },
};
