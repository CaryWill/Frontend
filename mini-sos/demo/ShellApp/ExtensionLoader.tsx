import React, { lazy, Suspense } from "react";
import { Container } from "inversify";
import "reflect-metadata";
import { resolveBundleInfo } from "../SOS/src/SOS/utils.ts";

export function ExtensionLoader(manifest) {
  const Component = lazy(async () => {
    const { loadModule } = globalThis.sos.container.get(
      Symbol.for("ModuleService")
    );
    const bundle = resolveBundleInfo(manifest);
    const module = await loadModule(bundle.packageName);
    return {
      default: module[manifest.entryPoint],
    };
  });
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}
