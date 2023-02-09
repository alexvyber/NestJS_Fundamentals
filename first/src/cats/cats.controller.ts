import {
  Body,
  Controller,
  Delete,
  Get,
  // HttpCode,
  // HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  // Res,
  // SetMetadata,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Protocol } from 'src/common/decorators/protocol.decorator';
// import { throws } from 'assert';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/paginationquery.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int/parse-int.pipe';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@ApiTags('Cats')
@UsePipes(new ValidationPipe())
@Controller('cats')
export class CatsController {
  constructor(private readonly catsServcice: CatsService) {}

  @ApiResponse({ status: 403, description: 'Some Forbidden Shit' })
  @Public()
  @Get()
  async findAll(
    @Protocol('some protocol here!!!!') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log('🚀 ~ CatsController ~ protocol', protocol);
    if (Math.random() > 0.5) throw new Error('Some Error');

    await new Promise((resolve) => setTimeout(resolve, 4400));
    return this.catsServcice.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('🚀 ~ CatsController ~ findOne ~ id', id);
    // console.log(typeof id);
    return this.catsServcice.findOne('' + id);
  }

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsServcice.create(createCatDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCatDto: UpdateCatDto,
  ) {
    return this.catsServcice.update(id, updateCatDto);
  }

  @Delete(':id')
  remvoe(@Param('id') id: string) {
    return this.catsServcice.remove(id);
  }
}
