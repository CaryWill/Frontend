const express = require("express");
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

//username and password
const myusername = "user1";
const mypassword = "mypassword";

app.get("/", (req, res) => {
  if (req.session.userid) {
    console.log("logged in");
  } else {
    console.log("need login");
  }
  res.sendFile(path.join(__dirname, "/session.html"));
});

app.post("/login", (req, res) => {
  if (req.body.username == myusername && req.body.password == mypassword) {
    // 登陆成功后，服务器会为当前用户创建一个 session，并用一个字符串来（session id）来识别这个 session
    req.session.views = 0;
    req.session.userid = req.body.username;
    console.log(req.session);
    // 服务器会向客户端发送 cookie，里面包含着 session id
    res.send("logged in");
  } else {
    // 登陆失败的话，session 不会被创建
    res.send("Invalid username or password");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.post("/getData", (req, res) => {
  // 拿着 cookie 里的 session id 去服务器查看有没有，有的话返回该 session 的数据
  console.log("getdata", req.session);
  if (req.session.userid) {
    res.send(`views: ${req.session.views++}`);
  } else {
    res.send("false");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
