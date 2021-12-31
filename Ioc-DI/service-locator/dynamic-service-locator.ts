// A Dynamic Service Locator
// 相对于 Service Locator 只能 load 单个 service 来说，Dynamic Service Locator 可以提供多个 service
// Service Locator
interface Movie {
  director: string;
}
interface MovieFinder {
  findAll(): Array<Movie>;
}

class ServiceLocator1 {
  private static soleInstance: ServiceLocator1;
  private services: { [key: string]: any } = {};

  public static getService(key: string) {
    return ServiceLocator1.soleInstance.services[key];
  }

  public loadService(key: string, service: Object) {
    this.services[key] = service;
  }

  public static load(arg: ServiceLocator1) {
    ServiceLocator1.soleInstance = arg;
  }
}

class MovieLister1 {
  serviceName: string = "";
  finder?: MovieFinder;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  public moviesDirectedBy(director: string) {
    this.finder = ServiceLocator1.getService(this.serviceName);
    if (!this.finder) return [];
    const allMovies = this.finder.findAll();
    return allMovies.filter((m) => m.director === director);
  }
}

class ColonMovieFinder1 implements MovieFinder {
  fileName: string = "";

  public constructor(fileName: string) {
    this.fileName = fileName;
  }

  findAll() {
    return [{ director: "cary" }];
  }
}

class Tester1 {
  private configure() {
    const locator = new ServiceLocator1();
    locator.loadService("MovieFinder", new ColonMovieFinder1("movies1.txt"));
    ServiceLocator1.load(locator);
  }

  public testSimple() {
    this.configure();
    const lister = new MovieLister1("MovieFinder");
    const movies = lister.moviesDirectedBy("cary");
    console.log(movies);
  }
}

// main
const tester1 = new Tester1();
tester1.testSimple();

// https://martinfowler.com/eaaCatalog/registry.html
// https://martinfowler.com/articles/injection.html
