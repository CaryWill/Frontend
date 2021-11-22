// demo 来自 https://juejin.cn/post/6844903655619969038

const express = require("express");
const app = express();
const port = 8080;
const fs = require("fs");
const path = require("path");

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Document</title>
    </head>
    <body>
        Http Cache Demo
        <script src="/demo.js"></script>
    </body>
    </html>`);
});

app.get("/demo.js", (req, res) => {
  let jsPath = path.resolve(__dirname, "./static/js/demo.js");
  let cont = fs.readFileSync(jsPath);
  res.end(cont);
});

app.listen(port, () => {
  console.log(`listen on ${port}`);
});
