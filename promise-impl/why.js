// example
// new Promise((res, rej) => {
//   setTimeout(rej, 1000);
// })
//   .then(() => {
//     console.log(1);
//   })
//   .then(() => {
//     console.log(2);
//   })
//   .catch(() => {
//     console.log(3);
//   })
//   .catch(() => {
//     console.log(4);
//   });

// 大概还是花了 15 分钟写完
// 虽然思路听清晰的
const State = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
};
function MyPromise(executor) {
  this.state = State.PENDING;
  this.value = undefined;
  this.reason = undefined;
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  const onResolve = (v) => {
    if (state !== State.PENDING) return;

    this.state = State.FULFILLED;
    this.value = v;
    this.onFulfilledCallbacks.forEach((callbackfn) => callbackfn(v));
  };

  const onReject = (r) => {
    if (state !== State.PENDING) return;

    this.state = State.REJECTED;
    this.reason = r;
    this.onRejectedCallbacks.forEach((callbackfn) => callbackfn(r));

    executor(onResolve, onReject);
  };
}

function resolvePromise(x, res, rej) {
  if (x instanceof MyPromise) {
    // adopt its state
    x.then(
      (v) => resolvePromise(v, res, rej),
      (r) => rej(r)
    );
  } else {
    res(x);
  }
}

MyPromise.prototype.then((onResolve, onReject) => {
  if (this.state === State.PENDING) {
    return new MyPromise((res, rej) => {
      this.onFulfilledCallbacks.push(() => {
        try {
          resolvePromise(onResolve(this.value), res, rej);
        } catch (error) {
          rej(error);
        }
      });
      this.onRejectedCallbacks.push(() => {
        try {
          resolvePromise(onReject(this.reason), res, rej);
        } catch (error) {
          rej(error);
        }
      });
    });
  }

  if (this.state === State.FULFILLED) {
    return MyPromise((res, rej) => {
      try {
        setTimeout(() => {
          resolvePromise(onResolve(this.value), res, rej);
        }, 0);
      } catch (error) {
        rej(error);
      }
    });
  }

  if (this.state === State.REJECTED) {
    return MyPromise((res, rej) => {
      try {
        setTimeout(() => {
          resolvePromise(onReject(this.reason), res, rej);
        }, 0);
      } catch (error) {
        rej(error);
      }
    });
  }
});
