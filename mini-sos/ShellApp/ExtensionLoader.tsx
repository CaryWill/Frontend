import React, { lazy, Suspense } from "react";
import { Container } from "inversify";
import "reflect-metadata";
import { resolveBundleInfo } from "../SOS/src/utils.ts";
import { ModuleServiceID } from "../SOS/src/services/ServiceIdentifiers.ts";

export function ExtensionLoader(manifest) {
  const LazyComponent = lazy(async () => {
    const { container } = globalThis.sos;
    const { loadModule } = container.get(ModuleServiceID);
    const bundle = resolveBundleInfo(manifest);
    const module = await loadModule(bundle.packageName);
    return {
      default: module[manifest.entryPoint],
    };
  });
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
