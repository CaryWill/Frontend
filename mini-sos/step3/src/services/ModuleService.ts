import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class ModuleService {
  registerModule(name: string, url: string) {
    globalThis.requirejs.config({
      paths: {
        [name]: url,
      },
    });
  }

  loadModule(name: string) {
    return new Promise((resolve, reject) => {
      globalThis.requirejs(
        [name],
        (module: any) => {
          resolve(module);
        },
        (err: string) => {
          reject(`${name} module load failed, ${err}`);
        }
      );
    });
  }
}
