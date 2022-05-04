const { Client, Collection, Intents } = require("discord.js");
const fs = require("fs");
const client = new Client({
  intents: Object.values(Intents.FLAGS),
  allowedMentions: {
    parse: ["users", "roles"],
  },
  shards: "auto",
});
const token = process.env.TOKEN;
const { Client: Statcord } = require("statcord.js");
const statcord = new Statcord({
  client,
  key: process.env.STATCORD_KEY,
  postCpuStatistics: true,
  postMemStatistics: true,
  postNetworkStatistics: true,
});

global.client = client;
global.bot = client;

client.commands = new Collection();
client.events = new Collection();
client.mongoEvents = new Collection();
client.stats = statcord;

const functions = fs
  .readdirSync("./functions/")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./events/")
  .filter((file) => file.endsWith(".js"));
const commandFolder = fs.readdirSync("./commands/");
const mongoEventFiles = fs
  .readdirSync("./mongoEvents")
  .filter((file) => file.endsWith(".js"));

(async () => {
  for (const file of functions) {
    require(`./functions/${file}`)(client);
  }

  client.stats.on("autopost-start", () => {
    console.log(
      `${"Autoposting session has now started!".green} Now sending data on ${
        `${client.user.username}`.rainbow
      } to ${"Statcord".blue}!`
    );
  });

  client.handleMongoEvents(mongoEventFiles, "./mongoEvents");
  client.handleClientEvents(eventFiles, "./events");
  client.handleCommands(commandFolder, "./commands");
  client.login(token);
})();
