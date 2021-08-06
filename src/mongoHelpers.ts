import { merge } from 'merge-anything';
import { KeysetPage } from './KeysetPage';
import { ObjectId } from 'mongodb';

type AllowedType = string | number | boolean;

export class MongoQueryBuilder {
  query: any;

  constructor() {
    this.query = {};
  }

  addIf(
    value: AllowedType | Array<AllowedType>,
    cb: (value: AllowedType | Array<AllowedType>) => any,
  ) {
    if (value) {
      this.query = merge(this.query, cb(value));
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
    .addIf(page.size, (size) => ({
      take: size,
    }))
    .addIf(page.orderBy && page.order, () => ({
      order: {
        [page.orderBy]: page.order === 'DES' ? -1 : 1,
      },
    }));
  return queryBuilder.query;
};
