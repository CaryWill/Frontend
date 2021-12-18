document.addEventListener(
  "DOMContentLoaded",
  function () {
    var answer = document.getElementById("input");
    document.getElementById("clickIt").addEventListener("click", () => {
      var config = JSON.stringify(answer.value);
      chrome.tabs.executeScript(
        {
          code: "var config = " + config,
        },
        function () {
          chrome.tabs.executeScript({ file: "answer.js" });
        }
      );
    });
  },
  false
);
