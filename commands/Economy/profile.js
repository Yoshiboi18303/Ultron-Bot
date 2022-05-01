const { MessageEmbed, MessageAttachment } = require("discord.js");
const Profiles = require("../../schemas/userSchema");
const colors = require("../../colors.json");
const { isHex, isHexColor } = require("ishex");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Access stuff about economy profiles")
    .addSubcommand((sc) =>
      sc
        .setName("view")
        .setDescription("View the profile of someone (or one of another user)!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("A user to view the profile of")
            .setRequired(false)
        )
    )
    .addSubcommand((sc) =>
      sc
        .setName("settings")
        .setDescription("Do stuff with your profile settings")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("What to do with the settings")
            .addChoice("view", "view")
            .addChoice("set", "set")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("setting")
            .setDescription("The setting to view/set")
            .setRequired(true)
            .addChoice("nickname", "nickname")
            .addChoice("passive", "passive")
            .addChoice("color", "color")
        )
        .addStringOption((option) =>
          option
            .setName("value")
            .setDescription(
              "The new value of the setting (required for changing a setting)"
            )
            .setRequired(false)
        )
    ),
  config: {
    timeout: ms("3s"),
    message: "Don't start spamming profiles now!",
  },
  async execute(interaction) {
    /*
    if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!` })
    */
    var subcommand = interaction.options.getSubcommand(false);
    if (!subcommand)
      return await interaction.reply({
        content:
          "Subcommands are a new part of this command, normal viewing is now deprecated, please use the new system.",
        ephemeral: true,
      });
    await interaction.deferReply();

    switch (subcommand) {
      case "view":
        const fetch = await import("node-fetch");
        var user = interaction.options.getUser("user") || interaction.user;
        if (user.bot)
          return await interaction.editReply({
            content: "The user is a bot, which can't be used in this system!",
            ephemeral: true,
          });
        var username_string;
        var usage_string;
        if (user.id == interaction.user.id) {
          username_string = "You don't";
          usage_string = "";
        } else {
          username_string = user.username + " doesn't";
          usage_string = "beg them to";
        }
        Profiles.findOne({ id: user.id }, async (err, data) => {
          // console.log(data)
          if (err) throw err;
          if (!data) {
            const no_data_embed = new MessageEmbed()
              .setColor(colors.red)
              .setTitle("Error")
              .setDescription(
                `Whoops! ${username_string} have any data! Please go ahead and ${usage_string} run \`/start\` if you want to have this command work!`
              );
            return await interaction.editReply({
              embeds: [no_data_embed],
              ephemeral: true,
            });
          } else {
            var f = await fetch.default(
              `https://weebyapi.xyz/generators/currency?type=dollar&amount=${data.coins}&token=${process.env.WEEBY_KEY}`,
              {
                method: "GET",
              }
            );
            var buffer = await f.buffer();
            var attachment = new MessageAttachment(buffer, "currency.png");
            var cafvc_vc = data.vault_max - data.vault;
            if (cafvc_vc < 0) cafvc_vc = 0;
            var cafvc_pc = data.vault_max - data.coins;
            if (cafvc_pc < 0) cafvc_pc = 0;
            // var computers = data.items.computers;
            // var padlocks = data.items.padlocks;
            /*
            if (computers == undefined || typeof computers == "undefined")
              computers = 0;
            if (padlocks == undefined || typeof padlocks == "undefined")
              padlocks = 0;
            */
            const profile_embed = new MessageEmbed()
              .setColor(data.color)
              .setTitle(`Profile of ${data.nickname}!`)
              .addFields([
                {
                  name: "Coins",
                  value: `${data.coins}`,
                  inline: true,
                },
                {
                  name: "Vault Amount",
                  value: `${data.vault}`,
                  inline: true,
                },
                {
                  name: "Vault Max",
                  value: `${data.vault_max}`,
                  inline: true,
                },
                {
                  name: "Vault Level",
                  value: `${data.vault_level}`,
                  inline: true,
                },
                {
                  name: "Is Passive?",
                  value: `${data.passive ? "Yes" : "No"}`,
                  inline: true,
                },
                {
                  name: "Started At",
                  value: `${moment
                    .utc(data.startedAt)
                    .format("HH:MM:SS - MM/DD/YYYY")}`,
                  inline: true,
                },
                {
                  name: "Coins Away From Max Vault Capacity (vault coins)",
                  value: `${cafvc_vc}`,
                  inline: true,
                },
                {
                  name: "Coins Away From Max Vault Capacity (pocket coins)",
                  value: `${cafvc_pc}`,
                  inline: true,
                },
              ])
              .setImage("attachment://currency.png");
            await interaction.editReply({
              embeds: [profile_embed],
              files: [attachment],
            });
          }
        });
        break;
      case "settings":
        /*
        if (interaction.guild.id != config.bot.testServerId)
          return await interaction.reply({
            content: `This part of the command is restricted to **${
              client.guilds.cache.get(config.bot.testServerId).name
            }** for the moment!`,
          });
        */
        var action = interaction.options.getString("action");
        Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
          if (err) throw err;
          if (!data) {
            const no_data_embed = new MessageEmbed()
              .setColor(colors.red)
              .setTitle("Error")
              .setDescription(
                `Sorry, I can't do anything with your settings without a profile of yours!\n\n**Run \`/start\` to make a profile!**`
              );
            return await interaction.editReply({
              embeds: [no_data_embed],
            });
          } else {
            var setting = interaction.options.getString("setting");
            switch (setting) {
              case "nickname":
                switch (action) {
                  case "view":
                    const current_nickname_embed = new MessageEmbed()
                      .setColor(colors.cyan)
                      .setTitle("Current Value for `nickname`")
                      .addField(
                        `Current Value:`,
                        `\`\`\`\n${data.nickname}\n\`\`\``,
                        false
                      )
                      .setTimestamp();
                    await interaction.editReply({
                      embeds: [current_nickname_embed],
                    });
                    break;
                  case "set":
                    var value = interaction.options.getString("value");
                    if (!value) {
                      const no_value_embed = new MessageEmbed()
                        .setColor(colors.red)
                        .setTitle("Error")
                        .setDescription(
                          "There's no new value specified for the nickname, please enter a value!"
                        );
                      return await interaction.editReply({
                        embeds: [no_value_embed],
                      });
                    }
                    var old_nickname = data.nickname;
                    if (
                      value == "default" ||
                      value == "reset" ||
                      "default" == value.toLowerCase() ||
                      "reset" == value.toLowerCase()
                    )
                      value = interaction.user.username;
                    if (
                      value == "previous" ||
                      "previous" == value.toLowerCase()
                    ) {
                      if (data.previousNickname == "")
                        value = interaction.user.username;
                      else value = data.previousNickname;
                    }
                    console.log(value.length);
                    if (value.length > 210) {
                      const too_long_embed = new MessageEmbed()
                        .setColor(colors.yellow)
                        .setTitle("Warning")
                        .setDescription(
                          "The nickname you have entered is too long, please type in a nickname that's 210 characters or less!"
                        )
                        .setTimestamp();
                      return await interaction.editReply({
                        embeds: [too_long_embed],
                      });
                    }
                    data = await Profiles.findOneAndUpdate(
                      {
                        id: interaction.user.id,
                      },
                      {
                        $set: {
                          nickname: value,
                          previousNickname: old_nickname,
                        },
                      }
                    );
                    data.save();
                    const new_nickname_embed = new MessageEmbed()
                      .setColor(colors.cyan)
                      .setTitle("New Value for `nickname`")
                      .addFields([
                        {
                          name: "Old Value",
                          value: `\`\`\`\n${old_nickname}\n\`\`\``,
                          inline: true,
                        },
                        {
                          name: "New Value",
                          value: `\`\`\`\n${value}\n\`\`\``,
                          inline: true,
                        },
                      ]);
                    await interaction.editReply({
                      embeds: [new_nickname_embed],
                    });
                    break;
                }
                break;
              case "passive":
                switch (action) {
                  case "view":
                    const current_passive_embed = new MessageEmbed()
                      .setColor(colors.cyan)
                      .setTitle("Current Value for `passive`")
                      .addField(
                        `Current Value:`,
                        `\`\`\`\n${data.passive ? "On" : "Off"}\n\`\`\``,
                        false
                      )
                      .setTimestamp();
                    await interaction.editReply({
                      embeds: [current_passive_embed],
                    });
                    break;
                  case "set":
                    var value = interaction.options.getString("value");
                    if (!value) {
                      const no_value_embed = new MessageEmbed()
                        .setColor(colors.red)
                        .setTitle("Error")
                        .setDescription(
                          "There's no new value specified for passive mode, please enter a value!"
                        );
                      return await interaction.editReply({
                        embeds: [no_value_embed],
                      });
                    } else if (!["true", "false"].includes(value)) {
                      const invalid_value_embed = new MessageEmbed()
                        .setColor(colors.red)
                        .setTitle("Error")
                        .setDescription(
                          `That's an invalid value for passive mode, please make sure it's either **\`true\`** or **\`false\`**`
                        );
                      return await interaction.editReply({
                        embeds: [invalid_value_embed],
                      });
                    }
                    var old_value = data.passive;
                    value = value.toLowerCase() == "true" ? true : false;
                    data = await Profiles.findOneAndUpdate(
                      {
                        id: interaction.user.id,
                      },
                      {
                        $set: {
                          passive: value,
                        },
                      }
                    );
                    data.save();
                    const new_passive_embed = new MessageEmbed()
                      .setColor(colors.cyan)
                      .setTitle("New Value for `passive`")
                      .addFields([
                        {
                          name: "Old Value",
                          value: `\`\`\`\n${old_value ? "On" : "Off"}\n\`\`\``,
                          inline: true,
                        },
                        {
                          name: "New Value",
                          value: `\`\`\`\n${value ? "On" : "Off"}\n\`\`\``,
                          inline: true,
                        },
                      ]);
                    await interaction.editReply({
                      embeds: [new_passive_embed],
                    });
                    break;
                }
                break;
              case "color":
                switch (action) {
                  case "view":
                    const current_color_embed = new MessageEmbed()
                      .setColor(data.color)
                      .setTitle("Current value for `color`")
                      .addField(
                        "Current Value",
                        `\`\`\`\n${data.color}\n\`\`\``,
                        false
                      );
                    await interaction.editReply({
                      embeds: [current_color_embed],
                    });
                    break;
                  case "set":
                    var value = interaction.options.getString("value");
                    if (!value) {
                      const no_value_embed = new MessageEmbed()
                        .setColor(colors.red)
                        .setTitle("Error")
                        .setDescription(
                          "There's no new value specified for your color, please enter a value!"
                        );
                      return await interaction.editReply({
                        embeds: [no_value_embed],
                      });
                    }
                    console.log(value);
                    if (
                      value == "previous" ||
                      "previous" == value.toLowerCase()
                    ) {
                      if (data.previousColor == "") value = data.color;
                      else {
                        value = data.previousColor;
                        value_is_previous = true;
                      }
                    }
                    if (isHex(value) || isHexColor(value)) {
                      if (isHex(value)) {
                        value = `#${value}`;
                        console.log(value);
                      }
                      var old_color = data.color;
                      data = await Profiles.findOneAndUpdate(
                        {
                          id: interaction.user.id,
                        },
                        {
                          $set: {
                            color: value,
                            previousColor: old_color,
                          },
                        }
                      );
                      data.save();
                      const new_color_embed = new MessageEmbed()
                        .setColor(colors.cyan)
                        .setTitle("New Value for `color`")
                        .addFields([
                          {
                            name: "Old Value",
                            value: `\`\`\`\n${old_color}\n\`\`\``,
                            inline: true,
                          },
                          {
                            name: "New Value",
                            value: `\`\`\`\n${value}\n\`\`\``,
                            inline: true,
                          },
                        ]);
                      await interaction.editReply({
                        embeds: [new_color_embed],
                      });
                    } else {
                      const invalid_value_embed = new MessageEmbed()
                        .setColor(colors.red)
                        .setTitle("Error")
                        .setDescription("That's not a valid hex or hex color!");
                      return await interaction.editReply({
                        embeds: [invalid_value_embed],
                      });
                    }
                    break;
                }
                break;
            }
          }
        });
        break;
    }
  },
};
