// import { IsBoolean, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCatDto } from './create-cat.dto';

export class UpdateCatDto extends PartialType(CreateCatDto) {
  // @IsString()
  // readonly name: string;
  // @IsBoolean()
  // readonly stupid: boolean;
  // @IsBoolean()
  // readonly active: boolean;
  // @IsString({ each: true })
  // readonly words: string[];
}
