import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';
import { Word } from './entities/word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cat, Word])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
