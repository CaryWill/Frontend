function MyMap() {
  this.keys = [];
  this.values = [];

  // O(n)
  this.set = (k, v) => {
    this.keys.push(k);
    this.values.push(v);
  };

  // O(n)
  this.get = (k) => {
    const index = keys.findIndex((v) => v === k);
    return this.values[index];
  };
}

let person = {
  id: "123456",
};

Object.freeze(person);

const weakMap = new WeakMap();
weakMap.set(person, { name: "cary", phone: "12345678" });
console.log(weakMap.get(person));
person = null;
console.log(weakMap.get(person));

// > function MyWeakMap() {
//   ...   this.uniqueKey = Symbol("foo");
//   ...
//   ...   this.set = (k, v) => {
//   ...     k[this.uniqueKey] = v;
//   ...   };
//   ...
//   ...   this.get = (k) => {
//   ...     return k[this.uniqueKey];
//   ...   };
//   ... }
//   undefined
//   > global.gc()
//   undefined
//   > process.memoryUsage();
//   {
//     rss: 36241408,
//     heapTotal: 5980160,
//     heapUsed: 4267632,
//     external: 932212,
//     arrayBuffers: 10074
//   }
//   > let wm = new MyWeakMap();
//   undefined
//   > let b = new Object();
//   undefined
//   > global.gc();
//   undefined
//   > process.memoryUsage();
//   {
//     rss: 36700160,
//     heapTotal: 5980160,
//     heapUsed: 4440264,
//     external: 932252,
//     arrayBuffers: 10074
//   }
//   > wm.set(b, new Array(5*1024*1024));
//   undefined
//   > global.gc();
//   undefined
//   > process.memoryUsage();
//   {
//     rss: 78725120,
//     heapTotal: 47939584,
//     heapUsed: 46021296,
//     external: 932252,
//     arrayBuffers: 10074
//   }
//   > b = null;
//   null
//   > global.gc();
//   undefined
//   > process.memoryUsage();
//   {
//     rss: 36847616,
//     heapTotal: 5980160,
//     heapUsed: 4094912,
//     external: 932252,
//     arrayBuffers: 10074
//   }
