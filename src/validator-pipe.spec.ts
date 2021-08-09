import { IsNumber, IsString } from 'class-validator';
import { ValidationPipe } from './validator.pipe';

class TestValidation {
  @IsString()
  string: any;

  @IsNumber()
  number: any;
}

describe('Validator Pipe', () => {
  it('Should return true bc object needs to be validated', () => {
    expect(ValidationPipe.toValidate(TestValidation)).toBe(true);
  });

  it('Should return false bc type is a primitive', () => {
    expect(ValidationPipe.toValidate(Boolean)).toBe(false);
  });

  it('Should validate incoming objects and cast to type', async () => {
    const obj = {
      string: 'test',
      number: 10,
    };
    const pipe = new ValidationPipe();
    const validated = await pipe.transform(obj, {
      metatype: TestValidation,
      type: 'body',
    });
    expect(validated).toBeInstanceOf(TestValidation);
    expect(validated.string).toBe('test');
    expect(validated.number).toBe(10);
  });

  it('Should validate incoming objects and cast to type', async () => {
    expect.assertions(2);
    const obj = {
      string: 10909,
      number: 'a string',
    };
    const pipe = new ValidationPipe();
    try {
      const validated = await pipe.transform(obj, {
        metatype: TestValidation,
        type: 'body',
      });
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.response.message).toEqual('Validation failed');
    }
  });

  it('Should remove unwanted field', async () => {
    const obj = {
      string: 'test',
      number: 10,
      unwanted: 'hello',
    };
    const pipe = new ValidationPipe();
    const validated = await pipe.transform(obj, {
      metatype: TestValidation,
      type: 'body',
    });
    expect(validated.unwanted).toBeUndefined();
  });
});
