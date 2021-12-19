function checkAnswers(answers = "") {
  if (
    document.getElementById("nowFormTitle").textContent.trim().includes("PSQI")
  ) {
    // PSQI
    const a = answers.slice();
    const sujects = document.querySelectorAll(".subjectBox").map((s) => {
      const firstLetter = s.firstElementChild.textContent.trim()[0];
      if (Number(firstLetter) >= 5 && Number(firstLetter) <= 19) {
        return true;
      } else if (["a", "b", "c", "d", "e"].includes(firstLetter)) {
        return true;
      } else {
        return false;
      }
    });
    a.split("").forEach((item, index) => {
      sujects[index].querySelectorAll("label")[item - 1].click();
    });
  } else {
    // 汉密尔顿抑郁量表（HAMD-17）
    // 汉密尔顿焦虑量表（HAMA）
    // PHQ-9
    const sujects = document.querySelectorAll(".subjectBox");
    answers.split("").forEach((item, index) => {
      sujects[index].querySelectorAll("label")[item - 1].click();
    });
  }
}
checkAnswers(config);
