// 25分钟 用时
// 思路： 将所有的任务添加到 pending 队列，在真正执行的时候检测 woking 里面的任务数
class Scheculer {
  constructor(max = 2) {
    this.working = [];
    this.pending = [];
    this._max = max;
  }

  addTask = (task) => {
    this.pending.push(task);
    this.autoRun();
  };

  autoRun = async () => {
    if (this.working.length < this._max && this.pending.length > 0) {
      this.working.push(this.pending.shift());
      this.autoRun();
    } else if (
      this.working.length === this._max ||
      (this.working.length > 0 && this.pending.length === 0)
    ) {
      await Promise.allSettled(this.working);
      this.working.length = 0;
      this.autoRun();
    }
  };
}

const scheculer = new Scheculer(2);
scheculer.addTask(new Promise(() => setTimeout(() => console.log(4)), 4000));
scheculer.addTask(new Promise(() => setTimeout(() => console.log(2)), 2000));
scheculer.addTask(new Promise(() => setTimeout(() => console.log(3)), 3000));
scheculer.addTask(new Promise(() => setTimeout(() => console.log(1)), 900));
