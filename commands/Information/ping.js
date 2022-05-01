module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the ping of the bot"),
  async execute(interaction) {
    await interaction.reply({
      content: `🏓 Pong! ${client.ws.ping}ms`,
    });
  },
};
