// Service Locator
interface Movie {
  director: string;
}
interface MovieFinder {
  findAll(): Array<Movie>;
}

class ServiceLocator {
  private static soleInstance: ServiceLocator;
  private movieFinder: MovieFinder;

  constructor(movieFinder: MovieFinder) {
    this.movieFinder = movieFinder;
  }

  public static movieFinder() {
    return ServiceLocator.soleInstance.movieFinder;
  }

  public static load(arg: ServiceLocator) {
    ServiceLocator.soleInstance = arg;
  }
}

class MovieLister0 {
  // use service locator then it's not a IoC
  finder: MovieFinder = ServiceLocator.movieFinder();

  public moviesDirectedBy(director: string) {
    if (!this.finder) return [];
    const allMovies = this.finder.findAll();
    return allMovies.filter((m) => m.director === director);
  }
}

class ColonMovieFinder0 implements MovieFinder {
  fileName: string = "";

  public constructor(fileName: string) {
    this.fileName = fileName;
  }

  findAll() {
    return [{ director: "cary" }];
  }
}

class Tester0 {
  private configure() {
    ServiceLocator.load(
      new ServiceLocator(new ColonMovieFinder0("movies1.txt"))
    );
  }

  public testSimple() {
    this.configure();
    const lister = new MovieLister0();
    const movies = lister.moviesDirectedBy("cary");
    console.log(movies);
  }
}

// main
const tester0 = new Tester0();
tester0.testSimple();

// https://martinfowler.com/eaaCatalog/registry.html
// https://martinfowler.com/articles/injection.html