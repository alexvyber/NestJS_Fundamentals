import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const int = parseInt(value, 10);

    console.log('🚀 ~ ParseIntPipe ~ transform ~ int', int);

    if (isNaN(int))
      throw new BadRequestException(`This shit: "${int}" is not an integer`);

    return int;
  }
}
