import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { throws } from 'assert';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsServcice: CatsService) {}

  @Get()
  mur() {
    return this.catsServcice.findAll();
  }

  //   @Get()
  //   findAll(@Query() pagQuery) {
  //     // const { limit, offset } = pagQuery;
  //     return this.catsServcice.findAll();
  //   }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catsServcice.findOne(id);
  }

  @Post()
  create(@Body() body) {
    return this.catsServcice.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.catsServcice.update(id, body);
  }

  @Delete(':id')
  remvoe(@Param('id') id: string) {
    return this.catsServcice.remove(id);
  }
}
