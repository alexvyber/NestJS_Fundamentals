import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';
import { Word } from './entities/word.entity';
import { Event } from '../evenst/entities/event.entity';
import { someShit, SOME_SHIT } from './cats.constants';
import { ConfigModule } from '@nestjs/config';
import { catsConfig } from './config/cats.config';

class ConfigService {}
class Some {}
class Other {}

@Injectable()
export class ShitFactory {
  doShit() {
    return 'shit';
  }

  create() {
    return ['four', 'five'];
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Cat, Word, Event]),
    ConfigModule.forFeature(catsConfig),
  ],
  controllers: [CatsController],
  providers: [
    CatsService,
    ShitFactory,
    {
      provide: SOME_SHIT,
      useValue: someShit,
    },

    {
      provide: 'OTHER_SHIT',
      useFactory: (shitFactory: ShitFactory): string[] => [
        ...someShit,
        ...shitFactory.create(),
        shitFactory.doShit(),
      ],
      inject: [ShitFactory],
    },

    {
      provide: 'ASYNC_SHIT',
      useFactory: async (connection: Connection): Promise<string[]> => {
        // console.log('🚀 ~ ASYNC_SHIT!!!!!!!!!');
        const shit = await Promise.resolve(['some', 'shit']);
        return shit;
      },
    },

    {
      provide: ConfigService,
      useClass: process.env.NODE_ENV === 'development' ? Some : Other,
    },
  ],
  exports: [CatsService],
})
export class CatsModule {}
