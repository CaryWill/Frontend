export const resolveBundleURL = (bundleManifest) => {
  const version = bundleManifest.version ? `${bundleManifest.version}/` : "";
  const segments = (bundleManifest.url + version + bundleManifest.modulePath).split(".");
  // remove extension
  segments.pop();
  return segments.join(".");
};

export const resolveFullname = (serviceManifest) => {
  const { bundleName, name, entryPoint } = serviceManifest;
  // 一般 name 和 entryPoint 是同名的
  return `${bundleName}.${name || entryPoint}`;
};
