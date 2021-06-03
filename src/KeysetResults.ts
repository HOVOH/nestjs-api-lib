export class KeysetResults {
  page: {
    lastToken?: string;
    firstToken?: string;
    size: number;
  };
  results: any[];

  constructor(results: any[]) {
    if (results && results.length > 0) {
      this.page = {
        lastToken: results[results.length - 1].id.toString(),
        firstToken: results[0].id.toString(),
        size: results.length,
      };
      this.results = results;
    } else {
      this.page = { size: 0 };
      this.results = [];
    }
  }
}
