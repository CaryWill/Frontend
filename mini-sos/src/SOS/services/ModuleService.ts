import { injectable } from "inversify";
import 'reflect-metadata';

@injectable()
export class ModuleService {
  registerModule(name, url) {
    globalThis.requirejs.config({
      paths: {
        [name]: url,
      },
    });
  }

  loadModule(name) {
    return new Promise((resolve, reject) => {
      globalThis.requirejs(
        [name],
        (module) => {
          console.log(module);
          resolve(module);
        },
        (err) => {
          reject("module load failed: ", err);
        }
      );
    });
  }
}
