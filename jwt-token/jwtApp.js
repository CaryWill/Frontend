const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.use(bodyParser.json());

// config
const accessTokenSecret = "my-32-character-ultra-secure-and-ultra-long-secret";
const refreshTokenSecret = "yourrefreshtokensecrethere";
let refreshTokens = [];

const users = [
  {
    username: "john",
    password: "password123admin",
    role: "admin",
  },
  {
    username: "anna",
    password: "password123member",
    role: "member",
  },
];

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/login", (req, res) => {
  // Read username and password from request body
  const { username, password } = req.body;

  // Filter user from the users array by username and password
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (user) {
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      accessTokenSecret,
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign(
      { username: user.username, role: user.role },
      refreshTokenSecret
    );

    refreshTokens.push(refreshToken);
    res.json({
      accessToken,
      refreshToken,
    });
  } else {
    res.send("Username or password incorrect");
  }
});

app.get("/checkJwt", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      res.send("true");
    });
  } else {
    res.sendStatus(401);
  }
});

// use refresh token to refresh access token
app.post("/refreshToken", (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.sendStatus(401);
  }
  // 这一步的作用是吊销 refresh token 以防 refresh token 也被人偷走了
  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }
  // 验证 token 是否有效，比如是否遭到篡改
  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      accessTokenSecret,
      { expiresIn: "1m" }
    );
    res.json({
      accessToken,
    });
  });
});

app.post("/logout", (req, res) => {
  const { token } = req.body;
  console.log(token, "token");
  // 删除 refresh token
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.send("Logout successful");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
