import { KeysetResults } from '..';

describe('KeysetResults', () => {
  it('Should construct and set tokens', () => {
    const result = new KeysetResults([1, 2, 3], (n) => n);
    expect(result.page.size).toBe(3);
    expect(result.page.firstToken).toBe(1);
    expect(result.page.lastToken).toBe(3);
    expect(result.results).toEqual([1, 2, 3]);
  });

  it('should be empty result whith []', () => {
    const result = new KeysetResults([], (t) => t);
    expect(result.page.size).toBe(0);
    expect(result.results).toEqual([]);
  });

  it('should be empty with null', () => {
    const result = new KeysetResults(null, (t) => t);
    expect(result.page.size).toBe(0);
    expect(result.results).toEqual([]);
  });
});
