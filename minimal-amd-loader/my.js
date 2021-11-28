// index 文件是别人的 只是分析下
// 现在自己手写看下理解了没
// draft
// https://github.com/CaryWill/Frontend/tree/master/minimal-amd-loader

(function () {
  const moduleMap = {}; // 已经定义好的模块 // 也就是一个模块里所有依赖都以完成了定义的模块
  const listeners = {};

  window.require = function (deps, definition) {
    // 执行一个模块
    // 逻辑和 define 一样
    if (deps.length > 0) {
      // 去 module map 里拿对应的值, 构造一个 arguments 的数组给 definition 函数
      const values = [];
      let depsLoaded = 0;
      deps.forEach((dep, index) => {
        if (moduleMap[dep]) {
          values[index] = moduleMap[dep];
        } else {
          // 设置对该依赖模块的监听 等该依赖模块定义完成再设置 values 对应的依赖的值
          // 因为有可能会有其他模块也监听我们这个依赖模块 所以这个依赖模块的监听应该是个数组
          if (!listeners[dep]) {
            listeners[dep] = [];
          }
          const updateValues = (v) => {
            // 更新 values 里面的值
            // 对于 deps 里找到 dep 的槽位 在 values 里对应的槽位也设置一遍这个值
            const indexes = [];
            for (let i = 0; i < deps.length; i++) {
              if (deps[i] === dep) {
                indexes.push(i);
              }
            }
            for (let i = 0; i < indexes.length; i++) {
              values[i] = v;
            }

            // 找到
            depsLoaded++;
            // 当所有的依赖模块都完成了加载 那么当前模块就算定义完成了
            // 将该模块驾到 moduleMap 里去
            if (depsLoaded >= deps.length) {
              definition(values);
            }
          };
          listeners[dep].push(updateValues);
        }
      });
    } else {
      definition([]);
    }
  };

  const resolve = (name, module) => {
    moduleMap[name] = module;
    // 完成了该模块的定义之后 去处理监听了这个模块的监听
    // 每一个 listener 其实就是 updateValues 方法，用来更新其 listner 模块的 values
    listeners[name].forEach((l) => {
      l(module);
    });
    listeners[name].length = 0;
  };

  window.define = function (name, deps, definition) {
    // 执行一个模块
    debugger;
    window.require(deps, function () {
      resolve(name, definition(arguments));
    });
  };
})();
