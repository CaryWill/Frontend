Promise._all = async (promises) => {
  const result = [];
  for (const promise of promises) {
    try {
      result.push(await promise);
    } catch (error) {
      return error;
    }
  }
  return Promise.resolve(result);
};
