const fs = require("fs");
const path = require("path");
const https = require("https");
const readline = require("readline");

// 所有的文件会下载到 download 文件夹默认
const downloadTo = "download/";
const downloadFile = (url) => {
  return new Promise((resolve, reject) => {
    // 获取文件名和文件夹路径
    const filename = path.basename(url);
    const folderPath = path.join(
      process.cwd(),
      path.dirname(
        downloadTo + url.split("//")[1].split("/").slice(1).join("/")
      )
    );
    console.log(folderPath);
    // 创建文件夹
    fs.mkdirSync(folderPath, { recursive: true });

    https
      .get(url, (response) => {
        const file = fs.createWriteStream(path.join(folderPath, filename));
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`success`);
          resolve(url);
        });
      })
      .on("error", (err) => {
        console.error(`fail: ${url}`);
        reject(url);
      });
  });
};

// 下载文件
const fromFile = "./download.txt";
async function processLineByLine() {
  const fileStream = fs.createReadStream(fromFile);
  // https://stackoverflow.com/a/32599033
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const url of lines) {
    // comment start with #
    if (!url.startsWith("#")) {
      await downloadFile(url);
    }
  }
}

processLineByLine();
