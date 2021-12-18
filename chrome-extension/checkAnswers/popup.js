document.addEventListener(
  "DOMContentLoaded",
  function () {
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
  },
  false
);
