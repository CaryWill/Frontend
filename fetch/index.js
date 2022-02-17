const old = window.fetch;
window.fetch = function (...args) {
  return old(...args).then(res => {
    if (res.status === 404) {
      console.log('redirect');
      // window.location.replace('https://www.google.com');
    }
    return res;
  }).catch(err => {
    throw err;
  });
}
document.getElementById('button').onclick = function () {
  fetch('www.baidu.com');
}