import { keySetFilter, MongoQueryBuilder } from './mongoHelpers';
import { KeysetPage } from './KeysetPage';
describe('MongoQueryBuilder', () => {
  it('Should merge objects', () => {
    const builder = new MongoQueryBuilder();
    builder.add({ test0: 'test0' });
    builder.add({ test1: 'test1' });
    expect(builder.query.test0).toEqual('test0');
    expect(builder.query.test1).toEqual('test1');
  });

  it('Should merge object deep', () => {
    const builder = new MongoQueryBuilder();
    builder.add({ test: { test0: 'test0' } });
    builder.add({ test: { test1: 'test1' } });
    expect(builder.query.test.test0).toEqual('test0');
    expect(builder.query.test.test1).toEqual('test1');
  });

  it('Should merge if true', () => {
    const builder = new MongoQueryBuilder();
    builder.addIf(true, () => ({ test: 'test' }));
    expect(builder.query.test).toEqual('test');
  });

  it('Should not merge if false', () => {
    const builder = new MongoQueryBuilder();
    builder.addIf(false, () => ({ test: 'test' }));
    expect(builder.query.test).toBeUndefined();
  });

  it('Should return the builder', () => {
    const builder = new MongoQueryBuilder();
    expect(builder.add({})).toBe(builder);
    expect(builder.addIf(false, () => ({}))).toBe(builder);
  });

  it('Should pass the (query, val) in callback fn', () => {
    const builder = new MongoQueryBuilder();
    builder.add({ test0: 'test0' });
    builder.addIf('test1', (query, val) => {
      query['test1'] = val;
      return query;
    });
    expect(builder.query.test0).toBe('test0');
    expect(builder.query.test1).toBe('test1');
  });
});

describe('KeysetFilter', () => {
  it('Should return a mongo query ordered by descending', () => {
    const page: KeysetPage<'orderableMember'> = {
      orderBy: 'orderableMember',
      order: 'DES',
      size: 10,
    };
    const filter = keySetFilter(page);
    expect(filter.order.orderableMember).toEqual(-1);
    expect(filter.where).toBeUndefined();
  });

  it('Should return a mongo query ordered by ascending with no keyset', () => {
    const page: KeysetPage<'orderableMember'> = {
      orderBy: 'orderableMember',
      order: 'ASC',
      size: 10,
    };
    const filter = keySetFilter(page);
    expect(filter.order.orderableMember).toEqual(1);
    expect(filter.where).toBeUndefined();
  });

  it('Should set a limit', () => {
    const page: KeysetPage<'orderableMember'> = {
      orderBy: 'orderableMember',
      order: 'ASC',
      size: 10,
    };
    const filter = keySetFilter(page);
    expect(filter.take).toEqual(10);
  });

  it('Should set keyset greater than', () => {
    const page: KeysetPage<'orderableMember'> = {
      keyset: 5,
      orderBy: 'orderableMember',
      order: 'ASC',
      size: 10,
    };
    const filter = keySetFilter(page);
    expect(filter.where.orderableMember.$gt).toBe(5);
  });

  it('Should set keyset less than', () => {
    const page: KeysetPage<'orderableMember'> = {
      keyset: 5,
      orderBy: 'orderableMember',
      order: 'DES',
      size: 10,
    };
    const filter = keySetFilter(page);
    expect(filter.where.orderableMember.$lt).toBe(5);
  });

  it('Should cast keyset', () => {
    expect.assertions(3);
    const page: KeysetPage<'orderableMember'> = {
      keyset: 5,
      orderBy: 'orderableMember',
      order: 'DES',
      size: 10,
    };
    const filter = keySetFilter(page, (field, keyset) => {
      expect(field).toBe('orderableMember');
      expect(keyset).toEqual(5);
      return 'test';
    });
    expect(filter.where.orderableMember.$lt).toBe('test');
  });
});
