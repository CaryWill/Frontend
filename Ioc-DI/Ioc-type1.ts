// Interface Injection(IoC type1)
interface Movie {
  director: string;
}
interface MovieFinder {
  findAll(): Array<Movie>;
}

interface InjectFinder {
  injectFinder(finder: MovieFinder): void;
}

interface Injector {
  // 具体往 target 里注入什么，需要注册器自己实现，毕竟一个类 conforms to 一个 interface 的话，一个 interface 也有很多的的方法，你是需要对这个类里所有的方法都注入呢还是怎么样，是吧
  inject(target: Object): void;
}

// FIXME: 如何将一个 interface 作为入参传给别人做 instanceof 的校验，java 里可以用 someInterface.class 来将 interface pass around
// 暂时一个 interface 只能有一个 method 好了，然后保持同名，首字母大小写区分，这样判断一个类是否 conform to 这个 interface 看有没有同名的 method 即可
interface InjectFinderFileName {
  injectFinderFileName(filename: string): void;
}

// 我希望使用 finder 这个对象，所以我需要实现这个 InjectFinder 接口 等待被注入 finder 对象
class MovieLister1 implements InjectFinder {
  finder?: MovieFinder;

  public injectFinder(finder: MovieFinder) {
    this.finder = finder;
  }

  public moviesDirectedBy(director: string) {
    if (!this.finder) return [];
    const allMovies = this.finder.findAll();
    return allMovies.filter((m) => m.director === director);
  }
}

// 既是要实现 InjectFinderFileName 的组件，同时又是实现了 inject 的注射器
class ColonMovieFinder1 implements MovieFinder, InjectFinderFileName {
  fileName: string = "";

  public injectFinderFileName(fileName: string) {
    this.fileName = fileName;
  }

  public inject(target: Object) {
    (target as InjectFinder).injectFinder(this);
  }

  findAll() {
    return [{ director: "cary" }];
  }
}

class FinderFilenameInjector implements Injector {
  inject(target: Object) {
    (target as InjectFinderFileName).injectFinderFileName("movies1.txt");
  }
}

const conformsTo = (interfaceName: string, instance: any) => {
  const method = interfaceName.charAt(0).toLowerCase() + interfaceName.slice(1);
  // 如果有和 interface 同名的 method，那么就表示这个 instance conforms to 这个 interface
  return instance[method];
};
class Container {
  components: any = {};
  injectors: any = {};

  public registerComponent(
    componentName: string,
    Component: any,
    ...props: any // 这里修改了下
  ) {
    // 这里模式是 组件名 - 组件
    this.components[componentName] = new Component(...props);
  }

  /**
   * interfaceName: 组件 conforms to 的 interface
   * injector: 注射器 顾名思义 就是负责往组件里面注入依赖的东西，所以它需要有一个 inject 方法，该方法接受一个组件,具体怎么注入得在 inject 方法里面实现
   */
  public registerInjector(interfaceName: string, injector: any) {
    // 这里的模式是 注入接口 - 注入器
    // 容器会遍历所有的组件，如果组件实现了注入接口，将调用对应的注入器，将这个组件作为参数，传递给注入器(就比如 ColonMovieFinder1 组件实例是一个注入器，因为它可以将它的 finder 实例注入给 MovieLister1 实例，这样我们就能调用它身上的 finder.findAll 方法获取所有电影了)
    this.injectors[interfaceName] = injector;
  }

  // 开始依赖注入
  public start() {
    // NOTE: hasOwnProperty(for 简洁性就暂时不做这个校验了)
    for (const component in this.components) {
      const instance = this.components[component];
      for (const interfaceName in this.injectors) {
        // 如果实例实现了这个接口(interface)的话 那么开始注入
        if (conformsTo(interfaceName, instance)) {
          // 实现了接口的组件 必须实现 inject 接口 以便做具体的注入
          this.injectors[interfaceName].inject(instance);
        }
      }
    }
  }

  public lookup(name: string) {
    return this.components[name];
  }
}

class Tester {
  public container: any;

  public registerComponents() {
    // 这两个组件都需要根据 interface 来注入实现
    this.container.registerComponent("MovieLister", MovieLister1);
    this.container.registerComponent("MovieFinder", ColonMovieFinder1);
    this.container.start();
  }

  public registerInjectors() {
    this.container.registerInjector(
      "InjectFinder",
      this.container.lookup("MovieFinder")
    );
    this.container.registerInjector(
      "InjectFinderFileName",
      new FinderFilenameInjector()
    );
  }

  public configureContainer() {
    this.container = new Container();
    this.registerComponents();
    this.registerInjectors();
    this.container.start();
  }
}

// main
const tester = new Tester();
tester.configureContainer();
const movieLister1 = tester.container.lookup("MovieLister");
const movies1 = movieLister1.moviesDirectedBy("cary");
console.log(movies1);

// https://martinfowler.com/articles/injection.html
// https://www.cnblogs.com/afarmer/p/4259133.html
// https://insights.thoughtworks.cn/injection/

// 对于不懂的东西一定要仔细看，像 .class 这个东西看不懂应该去查下或者问下才对，白天发现看不懂就是因为这个
// 晚上问了雷雷发现原来是这样的
