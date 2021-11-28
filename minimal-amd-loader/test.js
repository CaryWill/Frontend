define("framework", ["component", "library"], function (cmp, lib) {
  return {
    init:
      "initialized:\ncomponent: " +
      cmp.description +
      "\nand library: " +
      lib.version,
  };
});

require(["framework"], function (framework) {
  console.log(
    framework.init ===
      "initialized:\ncomponent: uses library version: 0.0.1\nand library: 0.0.1"
  );
});

define("library", [], function () {
  return { version: "0.0.1" };
});

define("component", ["library"], function (lib) {
  return { description: "uses library version: " + lib.version };
});
