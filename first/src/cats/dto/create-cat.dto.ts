import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateCatDto {
  @ApiProperty({ description: 'Name of the cat' })
  @IsString()
  readonly name: string;

  @IsBoolean()
  readonly stupid: boolean;

  @IsBoolean()
  readonly active: boolean;

  @ApiProperty({ example: ['one', 'two'] })
  @IsString({ each: true })
  readonly words: string[];
}
