import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class EngravingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  text: string;
}
