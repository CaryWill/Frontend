import { injectable } from "inversify";
import "reflect-metadata";
import { resolveFullName } from "../utils";

@injectable()
export class ExtensionService {
  // 其实注册一个扩展就是给给定的 service identifier 绑定一个 service 而已
  registerExtension(manifest) {
    const { container } = globalThis.sos;
    const serviceId = manifest.implements;
    const fullName = resolveFullName(manifest);
    // 你可以通过 `sos.container.getNamed(serviceId, fullName)` 获取到这个扩展
    // 以及可以通过 `sos.container.getAll(serviceId)` 获取到所有的扩展
    container
      .bind(Symbol.for(serviceId))
      .toDynamicValue(() => manifest)
      .when((request) => request.target.matchesNamedTag(fullName));
  }

  // 这个和注册扩展都是一回事
  registerExtensionImpl(serviceId, manifest) {
    this.registerExtension({
      ...manifest,
      implements: serviceId,
    });
  }

  // 那注册这个有啥用，只是让我们看下我们可以有哪些 service identifier 可以用来做插件等的吗
  registerExtensionPoint(serviceId) {
    // 你可以使用 `this.container.getAll(Symbol.for("ExtensionPointsServiceID"))` 来获取所有的扩展点 
    const { container } = globalThis.sos;
    container
      .bind(Symbol.for("ExtensionPointsServiceID"))
      .whenTargetNamed(serviceId);
  }
}
