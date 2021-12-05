const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.use(bodyParser.json());

// config
const accessToken = "my-32-character-ultra-secure-and-ultra-long-secret";
const refreshTokenSecret = 'yourrefreshtokensecrethere';
const refreshTokens = [];

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
  console.log(username, password, req.body);

  // Filter user from the users array by username and password
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (user) {
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      accessToken
    );
    res.json({
      accessToken,
    });
  } else {
    res.send("Username or password incorrect");
  }
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessToken, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
app.get("/checkJwt", authenticateJWT, (req, res) => {
  res.send("true");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
