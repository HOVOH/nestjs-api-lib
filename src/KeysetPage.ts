import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class KeysetPage {
  @IsString()
  @IsOptional()
  keyset: string;

  @Type((type) => Number)
  @IsPositive()
  @IsInt()
  @IsOptional()
  size: number;
}
