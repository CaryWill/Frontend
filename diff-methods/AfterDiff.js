import React, { useState, useRef, useEffect } from "react";

class ConfigService {
  constructor(config) {
    this.config = config || {};
    this.env = this.getEnv();
    // 通过给定的配置文件获取对应环境下的配置
    this.configByEnv = this.config[this.env];
  }

  // 抽离环境判断
  getEnv() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const isDingding = params.isDingding === "true";
    const isWx = params.isWx === "true";
    const isTaobao = params.isTaobao === "true";

    if (isDingding) {
      return "dingding";
    } else if (isWx) {
      return "wx";
    } else if (isTaobao) {
      return "taobao";
    } else {
      return "default";
    }
  }
}

// extract env checking condition by using a config file
const config = {
  dingding: {
    supported: false,
  },
  wx: {
    supported: true,
  },
  taobao: {
    supported: true,
  },
};

let configService = new ConfigService(config);
function App2() {
  // 其实我们只需要知道当前环境的配置就行了
  // 将多个条件判断抽成配置
  return (
    <div>{configService.configByEnv?.supported && <span>suppoorted</span>}</div>
  );
}

export default App2;
