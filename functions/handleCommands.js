const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client } = require("discord.js");

/**
 * @param {Client} client
 */
module.exports = (client) => {
  client.commandArray = [];
  client.handleCommands = async (commandFolders, path) => {
    for (folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`${path}/${folder}`)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`);

        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
      }
    }

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

    (async () => {
      try {
        const clientID = client.ready ? client.user.id : "969709884264292372";
        const guildID = "903394045445959711";
        console.log("Started refreshing application (/) commands.".blue);

        await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
          body: client.commandArray,
        });

        console.log(
          "Successfully reloaded application (/) commands.\nBot functions successfully made and completed!"
            .green
        );
        console.log(
          "\n--------------------------------------------------------------\n"
        );
      } catch (error) {
        console.error(error);
      }
    })();
  };
};
