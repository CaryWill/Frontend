// Test on Macos Only
var http = require("http");
var fs = require("fs");
var path = require("path");
var open = (url) => require("child_process").exec(`open ${url}`);
var hash = (str) =>
  require("crypto").createHash("md5").update(str).digest("hex");

// Create an instance of the http server to handle HTTP requests
let app = http.createServer((req, res) => {
  var filePath = "." + req.url;
  if (filePath == "./") filePath = "./index.html";
  var extname = path.extname(filePath);
  var contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      fs.writeFileSync(filePath, new Date().toISOString(), "utf-8");
      break;
  }

  fs.readFile(filePath, function (error, content) {
    // res.removeHeader("Cache-Control");
    if (error) return;
    res.writeHead(200, {
      "Content-Type": contentType,
      // Expires: "Wed, 21 Oct 2022 07:28:00 GMT",
      // "Cache-Control": "public,max-age=10",
    });
    let status = fs.statSync(filePath);
    let lastModified = status.mtime.toUTCString();
    if (lastModified === req.headers["if-modified-since"]) {
      res.writeHead(304, "Not Modified");
      res.end();
    } else {
      res.writeHead(200, "OK");
      res.writeHead(200, {
        "Cache-Control": "public,max-age=10",
        "Last-Modified": lastModified,
      });
      res.end(content);
    }
  });
});

// Start the server on port 3000
app.listen(3000, "127.0.0.1");
open("http://localhost:3000/index.html");
console.log("Node server running on port 3000");
