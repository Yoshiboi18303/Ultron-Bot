console.clear();
require("colors");
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
const { Client: C } = require("statcord.js");
const statcord = new C({
  client,
  key: process.env.STATCORD_KEY,
  postCpuStatistics: true,
  postMemStatistics: true,
  postNetworkStatistics: true,
});
const mongo = require("./mongo");

mongo(process.env.MONGO_CS, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
});

global.Discord = require("discord.js");
global.client = client;
global.bot = client;
global.MessageEmbed = require("discord.js").MessageEmbed;
global.colors = require("./colors.json");
global.config = require("./config.json");
global.admins = ["448507804584509442", "769750737646256140", config.bot.owner];
global.BotError = require("./classes/BotError");
global.CommandError = require("./classes/CommandError");
global.SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
global.moment = require("moment");
global.ms = require("ms");
global.mongoose = require("mongoose");
global.fs = require("fs");

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
