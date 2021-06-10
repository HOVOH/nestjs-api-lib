export class KeysetResults<T> {
  page: {
    lastToken?: string;
    firstToken?: string;
    size: number;
  };
  results: T[];

  constructor(results: T[], tokenCb: (t: T) => any) {
    if (results && results.length > 0) {
      this.page = {
        lastToken: tokenCb(results[results.length - 1]),
        firstToken: tokenCb(results[0]),
        size: results.length,
      };
      this.results = results;
    } else {
      this.page = { size: 0 };
      this.results = [];
    }
  }
}
