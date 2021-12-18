function checkAnswers(answers = "") {
  const sujects = document.querySelectorAll(".subjectBox");
  answers.split("").forEach((item, index) => {
    sujects[index].querySelectorAll("label")[item - 1].click();
  });
}
checkAnswers(config);
// 44244424333332
// 汉密尔顿抑郁量表（HAMD-17）
// 汉密尔顿焦虑量表（HAMA）
console.log(document, config);
alert("Example:" + config + JSON.stringify(document));
