console.clear();
require("colors");
const mongo = require("./mongo");

global.Discord = require("discord.js");
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
global.path = require("path");

mongo(process.env.MONGO_CS, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
});

require("./client");
require("./app");
