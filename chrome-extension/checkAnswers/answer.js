function checkAnswers(answers = "") {
  const sujects = document.querySelectorAll(".subjectBox");
  answers.split("").forEach((item, index) => {
    sujects[index].querySelectorAll("label")[item - 1].click();
  });
  // document.body.innerHTML = config;
}
checkAnswers(config);
// 44244424333332
// 汉密尔顿抑郁量表（HAMD-17）
// 汉密尔顿焦虑量表（HAMA）
