const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const Users = require("./schemas/userSchema");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  require("express-session")({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    store: require("connect-mongo").create({
      mongoUrl: process.env.MONGO_CS,
      ttl: 86400 * 2, // 2 days
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  var User = await Users.findOne({ id: user.id });
  if (!user)
    user = new Users({
      id: user.id,
    });

  done(null, {
    id: user.id,
    discord: user,
    // voted: User.voted,
    // blacklisted: User.blacklisted,
  });
});

passport.use(
  new DiscordStrategy(
    {
      clientID: "969709884264292372",
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/login/callback",
      scope: [/* "email", */ "identify", "guilds"],
    },
    (access, refresh, profile, done) => {
      process.nextTick(() => {
        done(null, profile);
      });
    }
  )
);

app.use("/static", express.static("static"));
app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));
// app.use(Handle404)

app.get(["/", "/home"], (req, res) => {
  res.status(200).render("index", {
    req,
  });
});

app.get(["/features", "/feats"], (req, res) => {
  res.status(200).render("features", {
    req,
  });
});

function Handle404(req, res, next) {
  res.status(404).render("404", {
    req
  })
}

app.listen(port);
console.log(
  "The website for Ultron is now listening on port ".green +
    `${port}`.blue +
    "!".green
);
