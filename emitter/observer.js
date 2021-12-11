// 观察者模式
// 目标主动添加观察者 并且在目标变动的时候通知观察者
// Observer/Observable pattern is mostly implemented in a synchronous way, i.e. the observable calls the appropriate method of all its observers when some event occurs. The Publisher/Subscriber pattern is mostly implemented in an asynchronous way (using message queue).
function Subject() {
  let observers = [];
  const add = (o) => {
    observers.push(o);
  };
  const notify = () => {
    observers.map((o) => o.update());
  };
  const remove = (o) => {
    observers = observers.filter((i) => i !== o);
  };

  return {
    add,
    remove,
    notify,
  };
}

function Observer(name) {
  const update = () => console.log(name);
  return {
    name,
    update,
  };
}

let subject = new Subject();

// 实例化两个观察者
let obs1 = new Observer("前端开发者");
let obs2 = new Observer("后端开发者");

// 向目标者添加观察者
subject.add(obs1);
subject.add(obs2);

// 目标者通知更新
subject.notify();
