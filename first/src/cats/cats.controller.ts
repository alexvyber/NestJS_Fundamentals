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
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

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
  findOne(@Param('id') id: number) {
    console.log(typeof id);
    return this.catsServcice.findOne('' + id);
  }

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    // console.log(createCatDto instanceof CreateCatDto);
    return this.catsServcice.create(createCatDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsServcice.update(id, updateCatDto);
  }

  @Delete(':id')
  remvoe(@Param('id') id: string) {
    return this.catsServcice.remove(id);
  }
}
