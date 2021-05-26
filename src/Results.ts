import { Page } from './Page';

export class Results {
  page: Page;
  results: any;

  constructor(page: Page, results: any) {
    this.page = page;
    this.results = results;
  }
}
