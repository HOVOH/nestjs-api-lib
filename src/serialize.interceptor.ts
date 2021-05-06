import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => serialize(data)));
  }
}

export const serialize = (object: any, options: ClassTransformOptions = {}) => {
  return classToPlain(object, {
    ...options,
    excludePrefixes: ['__', '_'].concat(
      options.excludePrefixes ? options.excludePrefixes : [],
    ),
  });
};
