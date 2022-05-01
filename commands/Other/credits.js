const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("credits")
    .setDescription("The credits for the bot developer!"),
  async execute(interaction) {
    /**
     * @param {String} name
     * @param {String} value
     * @param {Boolean} inline
     * @returns {Object}
     */
    function createField(name, value, inline) {
      if (!name) name = "Unknown Name";
      if (!value) value = "Unknown Value";
      if (!inline) inline = false;

      return {
        name,
        value,
        inline,
      };
    }

    const credits_embed = new MessageEmbed()
      .setColor(
        interaction.guild.members.cache.get(config.bot.owner).displayHexColor
      )
      .setTitle("Bot Developer Credits")
      .setDescription(
        `This bot was brought to you by **${
          client.users.cache.get(config.bot.owner).username
        }**!\nPlease check our his stuff here!`
      )
      .addFields([
        createField(
          "Twitter",
          "[Click me!](https://twitter.com/Yoshi_Brid)",
          true
        ),
        createField("Twitch", "[Click me!](https://twitch.tv/yoshiboi18303)"),
        createField("Website", "[Click me!](https://yoshiboi18303.tk)"),
        createField("GitHub", "[Click me!](https://github.com/Yoshiboi18303)"),
      ]);
    await interaction.reply({
      embeds: [credits_embed],
    });
  },
};
