// usecase: resize/input
const debounce = (fn, delay) => {
  let timer;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
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
