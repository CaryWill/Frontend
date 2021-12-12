const State = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
};

function MyPromise(executor) {
  this.state = State.PENDING;
  this.value = null;
  this.reason = null;
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  const resolve = (val) => {
    if (this.state !== State.PENDING) return;

    this.state = State.FULFILLED;
    this.value = val;

    this.onFulfilledCallbacks.forEach((callback) => {
      // 微任务(不过此处实现的方式是宏任务)
      setTimeout(callback, 0);
    });
  };

  const reject = (reason) => {
    if (this.state !== State.PENDING) return;

    this.state = State.REJECTED;
    this.reason = reason;

    this.onRejectedCallbacks.forEach((callback) => {
      // 微任务(不过此处实现的方式是宏任务)
      setTimeout(callback, 0);
    });
  };

  // executor 入参乱写导致报错等
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

// 用来解析 x 是 promise 的情况，保证 `then` 执行顺序
function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(
      new TypeError("The promise and the return value are the same")
    );
  }

  if (x instanceof MyPromise) {
    x.then(
      (y) => resolvePromise(promise, y, resolve, reject),
      (r) => reject(r)
    );
  } else if (typeof x === "object" || typeof x === "function") {
    if (x === null) return resolve(x);

    let then;
    try {
      then = x.then;
    } catch (error) {
      return reject(error);
    }

    // 如果是 thenable 的话
    // 这种情况有可能是 x.then 本身的实现有问题，比如 x 长这样 { then((res, rej) => {res();rej();})} 就会调用多次
    let called = false;
    if (typeof then === "function") {
      try {
        // 正如官网说的，这一点要注意 accessor property，所以推荐使用 then.call 而不是 x.then
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (error) {
        if (called) return;
        reject(error);
      }
    } else {
      resolve(x);
    }
  } else {
    resolve(x);
  }
}

MyPromise.prototype.then = function then(onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (r) => {
          throw r;
        };

  if (this.state === State.FULFILLED) {
    const promise = new MyPromise((resolve, reject) => {
      // 因为 fulfilled 了，所以直接加入到微任务中即可
      setTimeout(() => {
        try {
          const _value = onFulfilled(this.value);
          resolvePromise(promise, _value, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
    return promise;
  }

  if (this.state === State.REJECTED) {
    const promise = new MyPromise((resolve, reject) => {
      // 因为 rejected 了，所以直接加入到微任务中即可
      setTimeout(() => {
        try {
          const _reason = onRejected(this.reason);
          resolvePromise(promise, _reason, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
    return promise;
  }

  if (this.state === State.PENDING) {
    const promise = new MyPromise((resolve, reject) => {
      // 包一层然后加入到 callback list 中等待 this 被 settle
      // 包一层是因为有可能 onFulfilled() 返回 promise
      this.onFulfilledCallbacks.push(() => {
        try {
          const _value = onFulfilled(this.value);
          resolvePromise(promise, _value, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });

      this.onRejectedCallbacks.push(() => {
        try {
          const _reason = onRejected(this.reason);
          resolvePromise(promise, _reason, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    });
    // 直接返回以便 promise chaining
    return promise;
  }
};

MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

MyPromise.resolve = (value) => new MyPromise((resolve, _) => resolve(value));
MyPromise.reject = (reason) => new MyPromise((_, reject) => reject(reason));

module.exports = MyPromise;
