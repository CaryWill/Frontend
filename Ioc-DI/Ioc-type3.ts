// https://blogs.perficient.com/2021/09/22/an-abstract-take-on-the-dependency-injection-pattern/
interface Movie {
  director: string;
}
interface MovieFinder {
  findAll(): Array<Movie>;
}

// TODO: TS 优化下
// 我们只依赖 interface 来实现组件可以和任何的文件进行工作（finder)，实现通过注入呢？
// IoC
// Constructor Injection(IoC type3)
class MovieLister3 {
  finder;
  constructor(finder: MovieFinder) {
    this.finder = finder;
  }
  moviesDirectedBy(director: string) {
    const allMovies = this.finder.findAll();
    return allMovies.filter((m) => m.director === director);
  }
}

class ColonMovieFinder3 implements MovieFinder {
  fileName;
  constructor(fileName: string) {
    this.fileName = fileName;
  }
  findAll() {
    return [{ director: "cary" }];
  }
}

class Container3 {
  instance: any;

  registerComponentImplementation(Class: any, args: any = undefined) {
    this.instance = new Class(args || this.instance);
  }
}

// main
const cntr = new Container3();
// 我们可以将这个 finder 实现类替换成任意一个自定义实现
cntr.registerComponentImplementation(ColonMovieFinder3, "movies1.txt");
cntr.registerComponentImplementation(MovieLister3);
const movieLister3 = cntr.instance;
const movies3 = movieLister3.moviesDirectedBy("cary");
console.log(movies3);
