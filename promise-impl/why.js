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

// second time write promise impl