import { merge } from 'merge-anything';
import { KeysetPage } from './KeysetPage';
import { ObjectId } from 'mongodb';

export class MongoQueryBuilder {
  query: any;

  constructor() {
    this.query = {};
  }

  addIf(value: any, cb: (accumulator: any, value: any) => any) {
    if (value) {
      this.query = merge(this.query, cb(this.query, value));
    }
    return this;
  }

  add(subQuery: any) {
    this.query = merge(this.query, subQuery);
    return this;
  }
}

export const keySetFilter = (
  page: KeysetPage<string>,
  keysetMapping?: (
    field: string,
    keyset: string,
  ) => number | string | Date | ObjectId,
) => {
  const queryBuilder = new MongoQueryBuilder();
  if (keysetMapping) {
    page.keyset = keysetMapping(page.orderBy, page.keyset);
  }
  queryBuilder
    .addIf(page.orderBy && page.keyset, () => ({
      where: {
        [page.orderBy]: {
          [page.order === 'DES' ? '$lt' : '$gt']: page.keyset,
        },
      },
    }))
    .addIf(page.size, () => ({
      take: page.size,
    }))
    .addIf(page.orderBy && page.order, () => ({
      order: {
        [page.orderBy]: page.order === 'DES' ? -1 : 1,
      },
    }));
  return queryBuilder.query;
};
