export const resolveBundleURL = (bundleManifest) => {
  const version = bundleManifest.version ? `${bundleManifest.version}/` : "";
  const segments = (
    bundleManifest.url +
    version +
    bundleManifest.modulePath
  ).split(".");
  // remove extension
  segments.pop();
  return segments.join(".");
};

export const resolveFullName = (serviceManifest) => {
  const { bundleName, name, entryPoint } = serviceManifest;
  // 一般 name 和 entryPoint 是同名的
  return `${bundleName}.${name || entryPoint}`;
};

export const resolveBundleInfo = (manifest) => {
  // TODO: use symbol to store g_config
  const bundleList = globalThis.g_config?.bundle?.list || [];
  const matching = bundleList.find(
    (bundle) => bundle.bundleName === manifest.bundleName
  );
  if (!matching) {
    throw new Error("bundle not found");
  }
  return matching;
};
