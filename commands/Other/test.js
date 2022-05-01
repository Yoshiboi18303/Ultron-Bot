module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("A testing command"),
  async execute(interaction) {
    await interaction.reply({
      content: "Testing",
    });
  },
};
