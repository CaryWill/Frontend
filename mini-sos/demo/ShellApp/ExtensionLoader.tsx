import React, { lazy, Suspense } from "react";
import { Container } from "inversify";
import "reflect-metadata";

export function ExtensionLoader(manifest) {
  const Component = lazy(async () => {
    const { loadModule } = globalThis.sos.container.get(
      Symbol.for("ModuleService")
    );
    console.log(manifest.packageName);
    // TODO: find bundle first
    const module = await loadModule("@cary/demo");
    console.log(manifest);
    return {
      default: module[manifest.entryPoint],
    };
  });
  console.log(manifest);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}
