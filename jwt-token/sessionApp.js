const express = require("express");
// const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const path = require("path");
const app = express();
const PORT = 4000;
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
// app.use(cookieParser());

//username and password
const myusername = "user1";
const mypassword = "mypassword";

// a variable to save a session
var session;

app.get("/", (req, res) => {
  session = req.session;
  if (session.userid) {
    console.log("logged in");
    res.sendFile(path.join(__dirname, "/session.html"));
  } else res.sendFile(path.join(__dirname, "/session.html"));
});

app.post("/login", (req, res) => {
  if (req.body.username == myusername && req.body.password == mypassword) {
    session = req.session;
    session.userid = req.body.username;
    console.log(req.session);
    res.send("logged in");
  } else {
    res.send("Invalid username or password");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  console.log(session, req.session);
  res.redirect("/");
});

app.post("/getData", (req, res) => {
  if (req.session.userid) {
    res.send("true");
  } else {
    res.send("false");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
