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
    let as = answers.split("");
    let count = 0;

    function revise() {
      const item = as[count];
      const index = count;

      if (count === answers.length) {
        return;
      }

      // 点击修改按钮
      sujects[index].querySelectorAll(".revise")[0].click();

      // 等待 iframe 渲染完成，然后点击选项
      setTimeout(() => {
        const targetOption = document
          .querySelectorAll("#btnAlert iframe")[0]
          .contentWindow.document.getElementById("editAttbForm123")
          .querySelectorAll("label")[item - 1];
        targetOption.click();
        targetOption.click();
      }, 5000);

      // 提交修改
      setTimeout(() => {
        const submitbtn = document
          .querySelectorAll("#btnAlert iframe")[0]
          .contentWindow.document.getElementById("btnSubmitZy");
        console.log("submit", submitbtn);
        submitbtn.click();
      }, 6500);

      count++;

      //       setTimeout(() => revise(), 7000);
    }

    revise();
  }
}
checkAnswers(config);
