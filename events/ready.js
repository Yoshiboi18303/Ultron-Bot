const { generateDependencyReport } = require('@discordjs/voice');

module.exports = {
  name: "ready",
  once: false,
  async execute(client) {
    client.stats.on("post", (status) => {
      if (!status) {
        console.log(`${"Successful post!".green}`);
      } else {
        console.error(`${`${status}`.red}`);
      }
    });

    console.log(`${`${generateDependencyReport()}`.blue}`)

    client.stats.autopost();

    var statuses = [
      `${client.guilds.cache.get("903394045445959711").name}`,
      "the FUBU army",
      `${client.users.cache.size} users`,
      `F**king Useless But United`,
    ];
    var types = ["PLAYING", "LISTENING", "WATCHING", "STREAMING"];
    var urls = [
      "https://twitch.tv/yoshiboi18303",
      "https://www.twitch.tv/uselessbutunited",
      "https://www.twitch.tv/woodchat",
    ];

    setInterval(async () => {
      var status = statuses[Math.floor(Math.random() * statuses.length)];
      var type = types[Math.floor(Math.random() * types.length)];
      var url = urls[Math.floor(Math.random() * urls.length)];

      await client.user.setActivity(status, {
        type,
        url,
      });
    }, 15000);
    console.log(
      `${`${client.user.username}`.rainbow.underline.bold} has now logged on!`
    );
  },
};
