const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription("See some info about GitHub stuff!")
    .addSubcommand((sc) =>
      sc
        .setName("user")
        .setDescription("See some info about a GitHub user")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("The username of the specific user")
            .setRequired(true)
        )
    )
    .addSubcommand((sc) =>
      sc
        .setName("repository")
        .setDescription("See some info on a GitHub repository")
        .addStringOption((option) =>
          option
            .setName("owner")
            .setDescription("The owner of the repository.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("repository")
            .setDescription("The repository name.")
            .setRequired(false)
        )
    )
    .addSubcommand((sc) =>
      sc
        .setName("repositories")
        .setDescription("See all the repositories of a GitHub user")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("The username of the user.")
            .setRequired(true)
        )
    ),
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();
    const fetch = await import("node-fetch");
    const subcommand = interaction.options.getSubcommand();

    if (subcommand == "user") {
      var user = interaction.options.getString("username");

      var req = await fetch.default(`https://api.github.com/users/${user}`, {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });
      var data = await req.json();
      console.log(data);
      if (data.message == "Not Found")
        return await interaction.editReply({
          content: "That's not a valid GitHub username!",
        });
      const embed = new MessageEmbed()
        .setColor(interaction.member.displayHexColor)
        .setAuthor({
          name: data.login,
          url: data.html_url,
          iconURL: data.avatar_url,
        })
        .setDescription(`**\`${data.bio}\`**`)
        .addFields([
          {
            name: "Public Repo Count",
            value: `${data.public_repos}`,
            inline: true,
          },
          {
            name: "Public Gist Count",
            value: `${data.public_gists}`,
            inline: true,
          },
          {
            name: "Follower Count",
            value: `${data.followers}`,
            inline: true,
          },
          {
            name: "Following Count",
            value: `${data.following}`,
            inline: true,
          },
          {
            name: "Created At",
            value: `${moment
              .utc(data.created_at)
              .format("HH:MM:SS - MM/DD/YYYY")}`,
            inline: true,
          },
          {
            name: "Updated At",
            value: `${moment
              .utc(data.created_at)
              .format("HH:MM:SS - MM/DD/YYYY")}`,
            inline: true,
          },
        ])
        .setFooter({
          text: 'Please run "/github repository" to be able to see one of their repositories and it\'s info!',
        });
      await interaction.editReply({
        embeds: [embed],
      });
    } else if (subcommand == "repository") {
      var owner = interaction.options.getString("owner");
      var repo = interaction.options.getString("repository") || null;
      var req;

      if (repo != null) {
        req = await fetch.default(
          ` https://api.github.com/repos/${owner}/${repo}`,
          {
            method: "GET",
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
      } else {
        req = await fetch.default(
          `https://api.github.com/users/${owner}/repos`,
          {
            method: "GET",
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
      }

      var data = await req.json();

      if (data.message == "Not Found")
        return await interaction.editReply({
          content: "That's an unknown user/repository!",
        });

      if (repo == null) {
        repo = data[Math.floor(Math.random() * data.length)];

        // console.log(repo.license)

        const embed = new MessageEmbed()
          .setColor(interaction.member.displayHexColor)
          .setAuthor({
            name: repo.owner.login,
            url: repo.owner.html_url,
            iconURL: repo.owner.avatar_url,
          })
          .setDescription(
            `**\`${
              repo.description != null
                ? repo.description
                : "No description, website, or topics provided."
            }\`**`
          )
          .addFields([
            {
              name: "Repository Name",
              value: `${repo.name}`,
              inline: true,
            },
            {
              name: "Repository URL",
              value: `${
                !repo.private
                  ? `[Click me!](${repo.svn_url})`
                  : "Repository is private."
              }`,
              inline: true,
            },
            {
              name: "Is Forked?",
              value: `${repo.fork ? "Yes" : "No"}`,
              inline: true,
            },
            {
              name: "Stars Count",
              value: `${repo.stargazers_count}`,
              inline: true,
            },
            {
              name: "Watchers Count",
              value: `${repo.watchers_count}`,
              inline: true,
            },
            {
              name: "Is Forkable?",
              value: `${repo.allow_forking ? "Yes" : "No"}`,
              inline: true,
            },
            {
              name: "Is Archived?",
              value: `${repo.archived ? "Yes" : "No"}`,
              inline: true,
            },
            {
              name: "Is Disabled?",
              value: `${repo.disabled ? "Yes" : "No"}`,
              inline: true,
            },
            {
              name: "Repository License",
              value: `**${
                !repo.license
                  ? "None"
                  : `[${repo.license.name}](${repo.license.url})`
              }**`,
              inline: true,
            },
          ]);
        await interaction.editReply({
          embeds: [embed],
        });
      } else {
        repo = data;

        // console.log(repo.license)

        const embed = new MessageEmbed()
          .setColor(interaction.member.displayHexColor)
          .setAuthor({
            name: repo.owner.login,
            url: repo.owner.html_url,
            iconURL: repo.owner.avatar_url,
          })
          .setDescription(
            `**\`${
              repo.description != null
                ? repo.description
                : "No description, website, or topics provided."
            }\`**`
          )
          .addFields([
            {
              name: "Repository Name",
              value: `${repo.name}`,
              inline: true,
            },
            {
              name: "Repository URL",
              value: `${
                !repo.private
                  ? `[Click me!](${repo.svn_url})`
                  : "Repository is private."
              }`,
              inline: true,
            },
            {
              name: "Is Forked?",
              value: `${repo.fork ? "Yes" : "No"}`,
              inline: true,
            },
            {
              name: "Stars Count",
              value: `${repo.stargazers_count}`,
              inline: true,
            },
            {
              name: "Watchers Count",
              value: `${repo.watchers_count}`,
              inline: true,
            },
            {
              name: "Is Forkable?",
              value: `${repo.allow_forking ? "Yes" : "No"}`,
              inline: true,
            },
            {
              name: "Is Archived?",
              value: `${repo.archived ? "Yes" : "No"}`,
              inline: true,
            },
            {
              name: "Is Disabled?",
              value: `${repo.disabled ? "Yes" : "No"}`,
              inline: true,
            },
            {
              name: "Repository License",
              value: `**${
                !repo.license
                  ? "None"
                  : `[${repo.license.name}](${repo.license.url})`
              }**`,
              inline: true,
            },
          ]);
        await interaction.editReply({
          embeds: [embed],
        });
      }
    } else if (subcommand == "repositories") {
      var user = interaction.options.getString("username");
      var req = await fetch.default(
        `https://api.github.com/users/${user}/repos`
      );

      var data = await req.json();

      if (data.message == "Not Found")
        return await interaction.editReply({
          content: "That's not a valid GitHub user!",
        });

      var map = data.map(
        (repo) =>
          `**Name:** ${repo.name}, **Description:** \`${
            repo.description != null
              ? repo.description
              : "No description, website, or topics provided."
          }\``
      );

      const embed = new MessageEmbed()
        .setColor(interaction.member.displayHexColor)
        .setDescription(`${map.join("\n")}`);

      await interaction.editReply({
        embeds: [embed],
      });
    }
  },
};
