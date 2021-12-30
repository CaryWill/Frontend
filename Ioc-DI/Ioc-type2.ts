interface Movie {
  director: string;
}
interface MovieFinder {
  findAll(): Array<Movie>;
}

// IoC
// Setter Injection(IoC type2)
class MovieLister2 {
  _finder: any;

  public get finder() {
    return this._finder;
  }

  public set finder(finder: MovieFinder) {
    this._finder = finder;
  }

  moviesDirectedBy(director: string) {
    const allMovies = this.finder.findAll();
    return allMovies.filter((m) => m.director === director);
  }
}

class ColonMovieFinder2 implements MovieFinder {
  _fileName: any;

  get fileName() {
    return this._fileName;
  }

  set fileName(fileName: string) {
    this._fileName = fileName;
  }

  findAll() {
    return [{ director: "cary" }];
  }
}

class FileSystemXmlApplicationContext {
  config: any;

  constructor(config: any) {
    this.config = config;
  }

  getBean(id: string) {
    const { class: Class, property } = this.config[id];
    // FIXME: replace eval function
    const instance = eval(`new ${Class}()`);

    // calling setter on instance (setter injection)
    for (const p in property) {
      const [type, value] = property[p];
      if (type === "value") {
        instance[p] = value;
      }
      if (type === "ref") {
        instance[p] = this.getBean(value);
      }
    }

    return instance;
  }
}

// TODO: move config to separate file
const config = {
  MovieLister2: {
    class: "MovieLister2",
    property: {
      finder: ["ref", "MovieFinder2"],
    },
  },
  MovieFinder2: {
    class: "ColonMovieFinder2",
    property: {
      fileName: ["value", "movies1.txt"],
    },
  },
};

// main
try {
  const applicationContext = new FileSystemXmlApplicationContext(config);
  const movieLister2 = applicationContext.getBean("MovieLister2");
  const movies2 = movieLister2.moviesDirectedBy("cary");
  console.log(movies2);
} catch (error) {}
// https://martinfowler.com/articles/injection.html
