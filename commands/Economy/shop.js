const { MessageEmbed, MessageActionRow, MessageButton, CommandInteraction } = require("discord.js");
const Items = require("../../shopItems");
const Profiles = require("../../schemas/userSchema");
var item_number = 1;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Do stuff with the shop")
    .addSubcommand((sc) =>
      sc
        .setName("view")
        .setDescription(
          "View the items (or just one) currently for sale in the shop"
        )
        .addStringOption((option) =>
          option
            .setName("item")
            .setDescription("An item to view")
            .setRequired(false)
        )
    )
    .addSubcommand((sc) =>
      sc
        .setName("buy")
        .setDescription("Buy an item from the shop")
        .addStringOption((option) =>
          option
            .setName("item")
            .setDescription("The item to buy")
            .setRequired(true)
        )
    ),
  config: {
    timeout: ms("5s"),
    message: "Please don't spam the API.",
  },
  /**
    * @param {CommandInteraction} interaction
  */
  async execute(interaction) {
    var subcommand = interaction.options.getSubcommand();
    if (subcommand == "view") {
      var item = interaction.options.getString("item") || null;
      console.log(item);
      if (item == null) {
        const shop_embed = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle(`Shop`)
          .setDescription("Welcome to the shop, have a look around!");
        for (var item of Items) {
          shop_embed.description += `${item_number == 1 ? "\n" : ""}\n${
            item.image
          } ${item.item} **—** ${item.price}\n${item.desc}`;
          item_number++
        }
        await interaction.reply({
          embeds: [shop_embed],
        });
      } else {
        /*
        return await interaction.reply({
          content: "Coming soon!",
        });
        */
        var Profile = await Profiles.findOne({ id: interaction.user.id });
        await interaction.deferReply();
        var item = Items.find(
          (i) => i.id == item.toLowerCase() || i.item == item.toLowerCase()
        );
        if (!item) {
          const invalid_item_embed = new MessageEmbed()
            .setColor(colors.red)
            .setTitle("Error")
            .setDescription(
              "Invalid item name/id, please make sure to check the ids and names of every item in the shop."
            )
            .setTimestamp();
          return await interaction.editReply({
            embeds: [invalid_item_embed],
          });
        }
        var amount = Profile.items[`${item.item}`];
        const item_info_embed = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle(`${item.emoji} ${item.item} (${amount})`)                 .setDescription(`**\`${item.desc}\`**\n\n**Price:** ${item.price}\n\n`)
        await interaction.editReply({
          embeds: [item_info_embed]
        })
      }
    } else if (subcommand == "buy") {
      return await interaction.reply({
        content: "Coming soon!",
      });
    }
  },
};
