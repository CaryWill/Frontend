export const resolveBundleURL = (bundle) => {
  const version = bundle.version ? `${bundle.version}/` : "";
  const segments = (bundle.url + version + bundle.modulePath).split(".");
  // remove extension
  segments.pop();
  return segments.join(".");
};
