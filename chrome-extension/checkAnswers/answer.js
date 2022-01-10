function checkAnswers(answers = "") {
  if (
    document.getElementById("nowFormTitle").textContent.trim().includes("PSQI")
  ) {
    // PSQI
    const a = answers.slice();
    const subjects = [...document.querySelectorAll(".subjectBox")].filter(
      (s) => {
        const firstLetter = s.firstElementChild.textContent
          .trim()
          .split(".")[0]
          .trim();
        if (Number(firstLetter) >= 5 && Number(firstLetter) <= 19) {
          return true;
        } else if (
          ["a", "b", "c", "d", "e"].includes(
            s.firstElementChild.textContent.trim()[1]
          )
        ) {
          return true;
        } else {
          return false;
        }
      }
    );
    a.slice(5)
      .split("")
      .forEach((item, index) => {
        try {
          subjects[index].querySelectorAll("label")[item - 1].click();
        } catch (error) {
          console.log(item, subjects[index]);
        }
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
