// No DI
interface Movie {
  director: string;
}
interface MovieFinder {
  findAll(): Array<Movie>;
}

class ColonDelimitedMovieFinder {
  fileName: String;
  constructor(name: String) {
    this.fileName = name;
  }

  findAll() {
    // read file data by fileName
    console.log(`from: ${this.fileName}} file`);
    return [{ director: "cary" }];
  }
}

class MovieLister {
  private finder?: MovieFinder;
  public moviesDirectedBy(director: String) {
    this.finder = new ColonDelimitedMovieFinder("movies1.txt");
    const allMovies = this.finder.findAll();
    return allMovies.filter((m) => m.director === director);
  }
}

// main
const lister = new MovieLister();
const movies = lister.moviesDirectedBy("cary");
console.log(movies);
