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
  inject(target: Object): void;
}

// TODO: 如何将一个 interface 作为入参传给别人做 instanceof 的校验，java 里可以用 someInterface.class 来将 interface pass around
interface InjectFinderFileName {
  injectFinderFileName(filename: string): void;
}

class DefaultFinder {
  public findAll() {
    return [];
  }
}

// Interface Injection(IoC type1)
// 我希望使用 finder 这个对象，所以我需要实现这个 InjectFinder 接口 等待别人注入 finder 对象
class MovieLister1 implements InjectFinder {
  finder: MovieFinder = new DefaultFinder();

  public injectFinder(finder: MovieFinder) {
    this.finder = finder;
  }

  public moviesDirectedBy(director: string) {
    const allMovies = this.finder.findAll();
    return allMovies.filter((m) => m.director === director);
  }
}

// 这个是一个 finder 对象，我希望别人能将它注入到需要 finder 的组件里
// 我希望别人能将配置文件注入进来 injectFileName，这样我就可以根据文件名来获取数据了，在别人调用 finder 身上的 findAll 的时候可以返回对应的数据
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

class Container {
  components: any = {};
  injectors: any = {};

  public registerComponent(componentName: string, Component: any) {
    // 这里模式是 组件名 - 组件
    this.components[componentName] = new Component();
  }

  /**
   * interfaceName: 组件 conforms to 的 interface
   * injector: 注射器 顾名思义 就是负责往组件里面注入依赖的东西，所以它需要有一个 inject 方法，该方法接受一个组件
   */
  public registerInjector(interfaceName: string, injector: any) {
    // 这里的模式是 注入接口 - 注入器
    // 容器会遍历所有的组件，如果组件实现了注入接口，将调用对应的注入器，将这个组件作为参数，传递给注入器(就比如 ColonMovieFinder1 组件实例就是一个注入器，因为它可以将它的 finder 实例注入给 MovieLister1 实例，这样我们就能调用它身上的 finder.findAll 方法获取所有电影了)
    const fnName =
      interfaceName.charAt(0).toLowerCase() + interfaceName.slice(1);
    this.injectors[fnName] = injector;
  }

  // 开始依赖注入
  public start() {
    // FIXME: for in own property ?
    for (const component in this.components) {
      const instance = this.components[component];
      for (const inject in this.injectors) {
        // 如果实例实现了这个接口的话 那么开始注入
        if (instance[inject]) {
          // 实现了接口的组件 必须实现 inject 接口
          // TODO: 但是感觉虽然也没有必要
          this.injectors[inject].inject(instance);
        }
      }
    }
  }

  public lookup(name: string) {
    return this.components[name];
  }
}

class Tester {
  private container: any;

  private registerComponents() {
    // 这两个组件都需要根据 interface 来注入实现
    this.container.registerComponent("MovieLister", MovieLister1);
    this.container.registerComponent("MovieFinder", ColonMovieFinder1);
    this.container.start();
  }

  private registerInjectors() {
    this.container.registerInjector(
      "InjectFinder",
      this.container.lookup("MovieFinder")
    );
    this.container.registerInjector(
      "InjectFinderFileName",
      new FinderFilenameInjector()
    );
  }

  private configureContainer() {
    this.container = new Container();
    this.registerComponents();
    this.registerInjectors();
    this.container.start();
  }

  public testIface() {
    this.configureContainer();
    const movieLister1 = this.container.lookup("MovieLister");
    const movies1 = movieLister1.moviesDirectedBy("cary");
    console.log(movies1);
  }
}

// main
const tester = new Tester();
tester.testIface();

// https://martinfowler.com/articles/injection.html
// https://www.cnblogs.com/afarmer/p/4259133.html
// https://insights.thoughtworks.cn/injection/
