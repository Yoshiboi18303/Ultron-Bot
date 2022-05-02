const { MessageEmbed, Permissions } = require("discord.js");
const AFKUsers = require("../schemas/userSchema");
const wait = require("util").promisify(setTimeout);

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
    if (!message.author.bot && message.guild) {
      AFKUsers.findOne(
        {
          user: message.author.id,
        },
        async (err, data) => {
          if (err) throw err;
          if (!data) {
            return;
          } else {
            if (data.message != "" && message.author.id === data.user) {
              const wb_embed = new MessageEmbed()
                .setColor(colors.blue)
                .setTitle("Welcome Back!")
                .setDescription(
                  `Hello and welcome back <@${message.author.id}>, I have removed your AFK.`
                )
                .setTimestamp();
              data = await AFKUsers.findOneAndUpdate(
                {
                  user: message.author.id,
                },
                {
                  message: "",
                }
              );
              data.save();
              if (
                message.guild.me
                  .permissionsIn(message.channel)
                  .has([
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.SEND_MESSAGES,
                  ])
              ) {
                var msg = await message.reply({
                  embeds: [wb_embed],
                });
                wait(15000).then(async () => await msg.delete());
              }
            }
          }
        }
      );
    }
  },
};
