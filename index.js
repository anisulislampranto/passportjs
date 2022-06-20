const express = require("express");
require("dotenv").config();
const app = express();
const { connectMongoose, User } = require("./database");
const ejs = require("ejs");
const passport = require("passport");
const { initializingPassport, isAuthenticated } = require("./passportConfig");
const expressSession = require("express-session");

connectMongoose();

initializingPassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

/// register new user
app.post("/register", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (user) return res.status(400).json("user already exist");

  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: newUser,
  });
});

// log in
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/register",
    successRedirect: "/",
  })
);

app.get("/profile", isAuthenticated, (req, res) => {
  res.send(req.user);
});

app.get("/logout", (req, res) => {
  req.logOut();
  //   res.redirect("/login");
  res.send("logged Out");
});

app.listen(3000, () => {
  console.log("listening on 3000");
});
