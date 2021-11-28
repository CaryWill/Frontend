// usecase: resize/input
// const debounce = (fn, delay) => {
//   let timer;
//   return function debounced(...args) {
//     clearTimeout(timer);
//     timer = setTimeout(() => fn(...args), delay);
//   };
// };
const debounce = (fn, delay = 2000, options = { leading: false }) => {
  let timer;
  const { leading } = options;
  return function debounced(...args) {
    console.log("test");
    clearTimeout(timer);
    if (leading && !timer) {
      fn(...args);
      timer = setTimeout(() => {
        fn(...args);
        timer = null;
      }, delay);
    } else {
      // 调用过程中才会设置定时器
      timer = setTimeout(() => {
        fn(...args);
        timer = null;
      }, delay);
    }
  };
};

// usecase: infinite scroll
const throttle = (fn, delay) => {
  let isThrottling = false;
  return (...args) => {
    if (!isThrottling) {
      isThrottling = true;
      fn(...args);
      setTimeout(() => {
        isThrottling = false;
      }, delay);
    }
  };
};
