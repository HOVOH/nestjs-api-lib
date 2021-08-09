import { Exclude } from 'class-transformer';
import { serialize, SerializeInterceptor } from './serialize.interceptor';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

class ToSerialize {
  @Exclude()
  exclude: string;

  include: string;
}

describe('serialize()', () => {
  it('should serialize classes', () => {
    const toSerialize = new ToSerialize();
    toSerialize.exclude = 'excluded';
    toSerialize.include = 'included';
    const serialized = serialize(toSerialize);
    expect(serialized.exclude).toBeUndefined();
    expect(serialized.include).toBe('included');
  });

  it('should exclude members prefixed with _ and __', () => {
    const serialized = serialize({
      _excluded: 'excluded',
      __excluded: 'excluded',
      included: 'included',
    });
    expect(serialized.__excluded).toBeUndefined();
    expect(serialized._excluded).toBeUndefined();
    expect(serialized.included).toBe('included');
  });
});
