module.exports = function (source) {

  console.log('---------------');
  console.log('source:', source);
  console.log('---------------');

  const renamed = source.replace(/test/g, 'name');
  return `export default ${JSON.stringify(renamed)}`;
}