import React, { useState, useEffect } from "react";
import { resolveFullName } from "../SOS/src/SOS/utils.ts";
import { ExtensionLoader } from "./ExtensionLoader.tsx";

export function PluginContainer(props) {
  const { slot } = props;
  const [loading, setLoading] = useState(false);
  const [extensions, setExtensions] = useState([]);

  // 插件管理页面可以对插件按照 slot 进行归类以及是否开启这个插件以及排序
  const fetchRemoteConfiguredPluginInfo = (manifest = {}) => {
    // 根据应用或者扩展来获取插件的配置信息
    const fullName = resolveFullName(manifest);
    // 现在先写死好了
    return Promise.resolve([
      {
        slotName: "Right",
        slotDisplayName: "右侧插件区",
        plugins: [
          {
            displayName: "插件1",
            slots: [],
            uuid: "com.test.bundle.Demo", // fullName
          },
          {
            displayName: "插件2",
            slots: [],
            uuid: "com.test.bundle.App", // fullName
          },
        ],
      },
    ]);
  };

  const getExtensions = async () => {
    // 获取所有的扩展
    const { container } = globalThis.sos;
    const extensionMap = container
      .getAll(Symbol.for("com.xixikf.workbench.Plugin"))
      .reduce((acc, extension) => {
        acc[resolveFullName(extension)] = extension;
        return acc;
      }, {});
    // 过滤
    const data = await fetchRemoteConfiguredPluginInfo();
    let _extensions = data.find((item) => item.slotName === slot);
    if (!_extensions) return [];
    _extensions = _extensions.plugins.map(
      (plugin) => extensionMap[plugin.uuid]
    );
    setExtensions(_extensions);
    return _extensions;
  };

  useEffect(() => {
    getExtensions();
  }, [slot]);

  return (
    <div>
      {extensions.map((e) => {
        return <ExtensionLoader key={e.name} {...e} />;
      })}
    </div>
  );
}
