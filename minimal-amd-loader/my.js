// 参考 // https://curiosity-driven.org/minimal-loader
// 手写一遍对 amd 的理解，并添加了注释

(function () {
  const moduleMap = {}; // 已经定义好的模块 // 也就是一个模块里所有依赖都以完成了定义的模块
  const listeners = {};

  /**
   * @title 加载依赖或者设置对依赖的监听
   */
  const onLoadDependency = (dep, listener) => {
    if (moduleMap[dep]) {
      // 模块已经被定义的话，那么直接更新我们的 _arguments 数组
      listener(moduleMap[dep]);
    } else if (listeners[dep]) {
      // 已经有别的模块监听该依赖了
      // 所以这个依赖模块的监听是个数组
      listeners[dep].push(listener);
    } else {
      listeners[dep] = [listener];
    }
  };

  /**
   * @desc 将模块加入到 moduleMap 中并调用其它依赖该模块的 listener 来更新其他依赖该模块的模块的 _arguments 值
   * @param {*} name 模块名
   * @param {*} module 模块(定义的返回值 definition())
   */
  const resolve = (name, module) => {
    moduleMap[name] = module;
    // 完成了该模块的定义之后 去处理监听了这个模块的监听
    // 每一个 listener 其实就是 updateValues 方法，用来更新其 listner 模块的 values
    listeners[name].forEach((l) => {
      l(module);
    });
    listeners[name].length = 0;
  };

  /**
   * @title 执行一个模块
   * @param {*} deps 执行该定义依赖的模块
   * @param {*} definition 定义在依赖模块加载（定义）完成后被调用
   */
  window.require = function (deps, definition) {
    if (deps.length > 0) {
      // 去 module map 里拿对应的值, 构造一个 _arguments 的数组给 definition 函数
      const _arguments = [];
      let depsLoaded = 0;
      deps.forEach((dep, index) => {
        // 更新 _arguments 的值，这个值最终会被我们的 definition 函数所消费
        const updateArguments = (v) => {
          _arguments[index] = v;
          depsLoaded++;
          // 当所有的 deps 都加载完成的时候，按照 deps 里 dep 的顺序，构造一个 _arguments 数组，每一项都是 dep 对应的值，也就是每一个模块的 definition()
          // 然后 definition 函数会被调用 _arguements 作为入参被消费（注意，数组要展开）
          if (depsLoaded >= deps.length) {
            definition(..._arguments);
          }
        };
        // 设置对 dep 的监听
        // 如果发现 dep 已完成加载(加载完成的能在 module map 里找到)，那么直接更新我们的 _arguements
        // 如果发现 dep 还没加载完成，那么设置对 dep 的监听，当 dep 加载完成，会调用我们的 updateArugments 方法来更新我们的 _arguments
        onLoadDependency(dep, updateArguments);
      });
    } else {
      definition([]);
    }
  };

  /**
   * @title 定义一个模块
   * @desc 和 require 函数功能一样，但是 define 函数会在依赖模块定义完成后将该模块加入到 moduleMap 中去，表示该模块被定义了
   * @param {*} name 模块名
   * @param {*} deps 该模块所依赖的模块
   * @param {*} definition 该模块的定义
   */
  window.define = function (name, deps, definition) {
    debugger;
    window.require(deps, function (...args) {
      resolve(name, definition(...args));
    });
  };
})();
