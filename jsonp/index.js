const express = require("express");
const app = express();
const port = 3000;

var router = express.Router();
app.get("/jsonp", function (req, res, next) {
  let data = {};
  const { callback } = req.query;
  res.send(`${callback}(${JSON.stringify(data)})`);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
