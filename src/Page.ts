import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class Page {
  @Type((type) => Number)
  @IsPositive()
  @IsInt()
  @IsOptional()
  offset: number;

  @Type((type) => Number)
  @IsPositive()
  @IsInt()
  @IsOptional()
  size: number;
}
