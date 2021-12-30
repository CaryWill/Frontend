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
  findAll: () => [{ director: "cary" }];
}

// TODO: 什么是耦合关系 是互相依赖吗
class MovieLister {
  private finder: MovieFinder;
  public moviesDirectedBy(director: String) {
    this.finder = new ColonDelimitedMovieFinder("movies1.txt");
    const allMovies = this.finder.findAll();
    return allMovies.filter((m) => m.director === director);
  }
}

// 我们只依赖 interface 来实现组件可以和任何的文件进行工作（finder)，实现通过注入呢？
// IoC