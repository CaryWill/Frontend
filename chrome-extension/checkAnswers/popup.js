document.addEventListener(
  "DOMContentLoaded",
  function () {
    // 填写答案
    document.getElementById("clickIt").addEventListener("click", () => {
      var config = JSON.stringify(document.getElementById("input").value);
      chrome.tabs.executeScript(
        {
          code: "var config = " + config,
        },
        function () {
          chrome.tabs.executeScript({ file: "answer.js" });
        }
      );
    });
    // 修正答案
    document.getElementById("revise").addEventListener("click", () => {
      var config = JSON.stringify(document.getElementById("input").value);
      chrome.tabs.executeScript(
        {
          code: "var config = " + config,
        },
        function () {
          chrome.tabs.executeScript({ file: "revise.js" });
        }
      );
    });
  },
  false
);
