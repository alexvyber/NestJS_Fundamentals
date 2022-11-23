import { IsBoolean, IsString } from 'class-validator';

export class CreateCatDto {
  @IsString()
  readonly name: string;

  @IsBoolean()
  readonly stupid: boolean;

  @IsBoolean()
  readonly active: boolean;

  @IsString({ each: true })
  readonly words: string[];
}
