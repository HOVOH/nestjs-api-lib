import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class KeysetPage<K> {
  @IsString()
  @IsOptional()
  keyset?: any;

  @IsString()
  @IsOptional()
  orderBy?: K;

  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DES'])
  order: 'ASC' | 'DES';

  @Type((type) => Number)
  @IsPositive()
  @IsInt()
  @IsOptional()
  size: number;
}
