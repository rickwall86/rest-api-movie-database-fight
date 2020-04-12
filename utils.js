// 'Debounce' reusable function with variable delay
const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    // If ID is present, this means the delay below from setTimeout has passed and timeoutId will now be undefined. ID will only be present whilst the setTimeout() is waiting for the delay to pass
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
