const express = require("express");
const app = express.Router();
const passport = require("passport");
const { MessageEmbed, WebhookClient } = require("discord.js");
const webhook = new WebhookClient({
  id: "971051337859100742",
  token: process.env.LOGIN_WH_TOKEN
})

app.get("/", (req, res, next) => {
  req.session.redirect = req.query.redirect;
  req.session.save();

  passport.authenticate("discord", { failureRedirect: "/" })(req, res, next);
});

app.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  async (req, res) => {
    const login_embed = new MessageEmbed()
      .setColor(colors.green)
      .setTitle("User Logged In")
      .setDescription("A user has logged into the website!")
      .addFields([
        {
          name: "Discord Username",
          value: "Test",
          inline: true
        },
        {
          name: "Discord ID",
          value: "Test",
          inline: true
        }
      ])
    res.redirect(req.session.redirect || "/");
    await webhook.send({
      embeds: [login_embed]
    })
  }
);

module.exports = app;
