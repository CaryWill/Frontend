import { Bundle, Manifest } from "@/types";

export const resolveBundleURL = (bundle: Bundle) => {
  const { version = "", url, modulePath } = bundle;
  // remove file extension
  const fullURL = `${url}${version ? version + "/" : ""}${modulePath}`;
  const [_, URL] = fullURL.match(/(.*)[.](.*)/)!;
  return URL;
};

export const resolveFullName = (serviceManifest: Manifest) => {
  // 一般 name 和 entryPoint 是同名的
  const { bundleName, name, entryPoint } = serviceManifest;
  return `${bundleName}.${name || entryPoint}`;
};

export const resolveBundleInfo = (manifest: any) => {
  // TODO: use symbol to store g_config
  const bundleList = globalThis.g_config?.bundle?.list || [];
  const matching = bundleList.find(
    (bundle: any) => bundle.bundleName === manifest.bundleName
  );
  return matching;
};
