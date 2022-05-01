const { MessageEmbed } = require("discord.js");
const Profiles = require("../../schemas/userSchema");
const wait = require("util").promisify(setTimeout);
const slotItems = ["🍎", "🍊", "🍇", "🍉", "🍓", "🍒"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slots")
    .setDescription("Roll the slot machine for a chance to win!")
    .addStringOption((option) =>
      option
        .setName("bet")
        .setDescription("How much money you want to bet")
        .setRequired(true)
    ),
  execute(interaction) {
    Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        const no_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            `You don't have any data in the database!\nRun \`/start\` to get some!`
          );
        return await interaction.reply({
          embeds: [no_data_embed],
          ephemeral: true,
        });
      } else {
        const coins = data.coins;
        var money = interaction.options.getString("bet");
        var win = false;

        if(money == "all") money = data.coins
        else money = parseInt(money)

        if(isNaN(money)) {
          const invalidNumberEmbed = new MessageEmbed()
            .setColor(colors.red)
            .setTitle("Error")
            .setDescription("That's not a number!")
          await interaction.reply({
            embeds: [invalidNumberEmbed]
          })
        }

        const moneyMore = new MessageEmbed()
          .setColor(colors.red)
          .setDescription(
            `Please stop being an idiot. You are betting more than you already have.`
          );

        if (money > coins)
          return interaction.reply({
            embeds: [moneyMore],
          });

        await interaction.deferReply();

        let number = [];
        for (i = 0; i < 3; i++) {
          number[i] = Math.floor(Math.random() * slotItems.length);
        }

        var random_choices = [0, 1, 2];

        const rolling_embed = new MessageEmbed()
          .setColor(colors.yellow)
          .setAuthor(`${interaction.user.username}'s Slot Machine`)
          .setDescription(
            `**${
              slotItems[
                number[
                  random_choices[
                    Math.floor(Math.random() * random_choices.length)
                  ]
                ]
              ]
            } | ${
              slotItems[
                number[
                  random_choices[
                    Math.floor(Math.random() * random_choices.length)
                  ]
                ]
              ]
            } | ${
              slotItems[
                number[
                  random_choices[
                    Math.floor(Math.random() * random_choices.length)
                  ]
                ]
              ]
            }**`
          );
        await interaction.editReply({
          embeds: [rolling_embed],
        });

        await wait(1750);

        rolling_embed.description = `**${
          slotItems[
            number[
              random_choices[Math.floor(Math.random() * random_choices.length)]
            ]
          ]
        } | ${
          slotItems[
            number[
              random_choices[Math.floor(Math.random() * random_choices.length)]
            ]
          ]
        } | ${
          slotItems[
            number[
              random_choices[Math.floor(Math.random() * random_choices.length)]
            ]
          ]
        }**`;

        await interaction.editReply({
          embeds: [rolling_embed],
        });

        await wait(1750);

        rolling_embed.description = `**${
          slotItems[
            number[
              random_choices[Math.floor(Math.random() * random_choices.length)]
            ]
          ]
        } | ${
          slotItems[
            number[
              random_choices[Math.floor(Math.random() * random_choices.length)]
            ]
          ]
        } | ${
          slotItems[
            number[
              random_choices[Math.floor(Math.random() * random_choices.length)]
            ]
          ]
        }**`;

        await interaction.editReply({
          embeds: [rolling_embed],
        });

        await wait(1750);

        rolling_embed.description = `**${
          slotItems[
            number[
              random_choices[Math.floor(Math.random() * random_choices.length)]
            ]
          ]
        } | ${
          slotItems[
            number[
              random_choices[Math.floor(Math.random() * random_choices.length)]
            ]
          ]
        } | ${
          slotItems[
            number[
              random_choices[Math.floor(Math.random() * random_choices.length)]
            ]
          ]
        }**`;

        await interaction.editReply({
          embeds: [rolling_embed],
        });

        await wait(3750);

        if (number[0] == number[1] && number[1] == number[2]) {
          money *= 9;
          win = true;
        } else if (
          number[0] == number[1] ||
          number[0] == number[2] ||
          number[1] == number[2]
        ) {
          money *= 2;
          win = true;
          if (win) {
            const slotsWinEmbed = new MessageEmbed()
              .setAuthor(`${interaction.user.username}'s Slot Machine`)
              .setDescription(
                `**${slotItems[number[0]]} | ${slotItems[number[1]]} | ${
                  slotItems[number[2]]
                }**\n\nNice job! You just won ${money} coins, that bet was amazing my man!`
              )
              .setColor(colors.green)
              .setFooter(
                `${interaction.user.username} has just won ${money} coins! Nice job!`
              );
            await interaction.editReply({
              embeds: [slotsWinEmbed],
            });
            data = await Profiles.findOneAndUpdate(
              {
                id: interaction.user.id,
              },
              {
                $inc: {
                  coins: money,
                },
              }
            );
            data.save();
          } else {
            const slotsLossEmbed = new MessageEmbed()
              .setAuthor(`${interaction.user.username}'s Slot Machine`)
              .setDescription(
                `**${slotItems[number[0]]} | ${slotItems[number[1]]} | ${
                  slotItems[number[2]]
                }**\n\nLmao. You just lost ${money} coin(s), you suck at this. **LOL**`
              )
              .setColor(colors.red)
            await interaction.editReply({
              embeds: [slotsLossEmbed],
            });
            data = await Profiles.findOneAndUpdate(
              {
                id: interaction.user.id,
              },
              {
                $set: {
                  coins: coins - money,
                },
              }
            );
            data.save();
          }
        }
      }
    });
  },
};
