// parse url query string
function getParams(url) {
  const params = {};
  const regex = /[?&]([^&=]+)=([^&#]*)/g;
  const replacer = (match, p1, p2) => {
    params[p1] = p2;
  };
  url.replaceAll(regex, replacer);
  return params;
}
// test

const url =
  "https://www.baidu.com/?id=10013027&&env=test&ver=base_1123_sh&appName=#/test";
console.log(getParams(url));
