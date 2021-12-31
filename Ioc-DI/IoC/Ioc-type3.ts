// IoC
// Constructor Injection(IoC type3)

interface Movie {
  director: string;
}
interface MovieFinder {
  findAll(): Array<Movie>;
}

class MovieLister3 {
  finder: MovieFinder;

  constructor(finder: MovieFinder) {
    this.finder = finder;
  }
  moviesDirectedBy(director: string) {
    const allMovies = this.finder.findAll();
    return allMovies.filter((m) => m.director === director);
  }
}

class ColonMovieFinder3 implements MovieFinder {
  fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  findAll() {
    // read file data by fileName
    console.log(`from: ${this.fileName}} file`);
    return [{ director: "cary" }];
  }
}

class Container3 {
  instance: any;

  registerComponentImplementation(
    ComponentImplementationClass: any,
    args: any = undefined
  ) {
    this.instance = new ComponentImplementationClass(args || this.instance);
  }
}

// main
const container = new Container3();
// 我们可以将这个 finder 实现类替换成任意一个自定义实现来实现解耦
container.registerComponentImplementation(ColonMovieFinder3, "movies1.txt");
container.registerComponentImplementation(MovieLister3);
const movieLister3 = container.instance;
const movies3 = movieLister3.moviesDirectedBy("cary");
console.log(movies3);

// https://blogs.perficient.com/2021/09/22/an-abstract-take-on-the-dependency-injection-pattern/
// https://github.com/picocontainer/NanoContainer/blob/master/container/src/java/org/nanocontainer/DefaultNanoContainer.java
