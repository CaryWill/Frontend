export interface Bundle {
  bundleName: string;
  modulePath: string;
  packageName: string;
  url: string;
  version: string;
}

export interface Lib {
  bundleName: string;
  preload?: boolean;
  resources: Array<{ type: string; url: string }>;
}

export interface Manifest {
  bundleName: string;
  displayName: string;
  entryPoint: string;
  name: string;
}

export interface Extension extends Manifest {
  implements: string;
}

export interface App extends Manifest {
  resources: Array<{ type: string; url: string }>;
  routePath: string;
  uuid: string;
}

