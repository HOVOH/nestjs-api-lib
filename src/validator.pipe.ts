import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Type } from '@nestjs/common/interfaces/type.interface';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !ValidationPipe.toValidate(metatype)) {
      return value;
    }
    const object = ValidationPipe.plainToClass(metatype, value);
    const errors = await validate(object, { whitelist: true });
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return object;
  }

  static plainToClass(type: Type<any>, value: any) {
    if (value.constructor.name !== type.name) {
      return plainToClass(type, value);
    }
    return value;
  }

  static toValidate(metatype: Type | undefined): boolean {
    const types: Type[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
