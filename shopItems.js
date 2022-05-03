/*
  These will consist of 6 properties:
    The name of the item, the id of it, the description of it (what it does, etc.), the emoji of it, the image to show, what type of item it is, and its price.
*/

module.exports = [
  {
    item: "Computer",
    id: "laptop",
    desc: "Allows you to start developing stuff",
    emoji: emojis.computer,
    image: "https://cdn.discordapp.com/emojis/971020230895751228.png",
    type: "powerup",
    price: 500,
  },
  {
    item: "Padlock",
    id: "padlock",
    desc: "Secures your wallet from any filthy thieves wanting to steal your money",
    emoji: emojis.padlock,
    image: "https://cdn.discordapp.com/emojis/971020728545734727.png",
    type: "powerup",
    price: 750,
  },
];