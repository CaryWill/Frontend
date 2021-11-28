// https://curiosity-driven.org/minimal-loader
(function () {
  var registry = {
    listeners: {},
    modules: {},
  };

  function addLoadListener(name, listener) {
    if (name in registry.modules) {
      // value is already loaded, call listener immediately
      listener(name, registry.modules[name]);
    } else if (registry.listeners[name]) {
      registry.listeners[name].push(listener);
    } else {
      registry.listeners[name] = [listener];
    }
  }

  function resolve(name, value) {
    registry.modules[name] = value;
    var libListeners = registry.listeners[name];
    if (libListeners) {
      libListeners.forEach(function (listener) {
        listener(name, value);
      });
      delete registry.listeners[name];
    }
  }

  window.require = function (deps, definition) {
    if (deps.length === 0) {
      // no dependencies, run definition now
      definition();
    } else {
      // we need to wait for all dependencies to load
      var values = [],
        loaded = 0;
      function dependencyLoaded(name, value) {
        values[deps.indexOf(name)] = value;
        if (++loaded >= deps.length) {
          definition.apply(null, values);
        }
      }
      deps.forEach(function (dep) {
        addLoadListener(dep, dependencyLoaded);
      });
    }
  };

  window.define = function (name, deps, definition) {
    debugger;
    if (!definition) {
      // 如果没有定义的时候什么意思
      // just two arguments - bind name to value (deps) now
      resolve(name, deps);
    } else {
      // asynchronous define with dependencies
      require(deps, function () {
        // 当这个 模块 被 resolved， 它调用的时候会被提供一个数组的参数(arguments)，也就是 deps
        resolve(name, definition.apply(null, arguments));
      });
    }
  };
})();
