// Test on Macos Only
var http = require("http");
var fs = require("fs");
var path = require("path");
var open = (url) => require("child_process").exec(`open ${url}`);

// Create an instance of the http server to handle HTTP requests
let app = http.createServer((req, res) => {
  var filePath = "." + req.url;
  if (filePath == "./") filePath = "./index.html";
  var extname = path.extname(filePath);
  var contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
  }

  res.removeHeader("Cache-Control");

  fs.readFile(filePath, function (error, content) {
    res.writeHead(200, {
      "Content-Type": contentType,
      // Expires: "Wed, 21 Oct 2022 07:28:00 GMT",
      "Cache-Control": "public,max-age=10",
    });
    res.end(content, "utf-8");
  });
});

// Start the server on port 3000
app.listen(3000, "127.0.0.1");
open("http://localhost:3000/");
console.log("Node server running on port 3000");
