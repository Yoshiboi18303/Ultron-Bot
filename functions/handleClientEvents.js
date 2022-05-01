const { Client } = require("discord.js");

/**
 * @param {Client} client
 */
module.exports = (client) => {
  console.log("Registering Client Events...".yellow);
  /**
   * Handles and starts listening for events related to the Discord.js Client
   * @param {Array<String>} eventFiles
   * @param {String} path
   */
  client.handleClientEvents = async (eventFiles, path) => {
    for (const file of eventFiles) {
      const event = require(`../events/${file}`);
      if (event.once) {
        console.log(
          `${
            `${
              event.name.replace(event.name[0], event.name[0].toUpperCase()) ==
              "InteractionCreate"
                ? "Interaction"
                : event.name.replace(event.name[0], event.name[0].toUpperCase())
            }`.blue
          } ${"client".blue} event registered to run once!`
        );
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        console.log(
          `${
            `${
              event.name.replace(event.name[0], event.name[0].toUpperCase()) ==
              "InteractionCreate"
                ? "Interaction"
                : event.name.replace(event.name[0], event.name[0].toUpperCase())
            }`.blue
          } ${"client".blue} event registered to run always!`
        );
        client.on(event.name, (...args) => event.execute(...args, client));
      }
      client.events.set(event.name, event);
    }
    console.log("Events registered!".green);
    console.log(
      "\n--------------------------------------------------------------\n"
    );
  };
};
