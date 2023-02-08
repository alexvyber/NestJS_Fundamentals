import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cat } from './entities/cat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Word } from './entities/word.entity';
import { PaginationQueryDto } from 'src/common/dto/paginationquery.dto';
import { Event } from 'src/evenst/entities/event.entity';
import { SomeShit, SOME_SHIT } from './cats.constants';
import { ConfigService, ConfigType } from '@nestjs/config';
import { catsConfig } from './config/cats.config';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
    private readonly connection: Connection,
    @Inject(SOME_SHIT) someShit: SomeShit,
    @Inject('OTHER_SHIT') otherShit: string[],
    @Inject('ASYNC_SHIT') asyncShit: string[],
    private readonly configService: ConfigService,
    @Inject(catsConfig.KEY)
    private readonly catsConfiguration: ConfigType<typeof catsConfig>,
  ) {
    // console.log('🚀 ~ CatsService ~ someShit', someShit);
    // console.log('🚀 ~ CatsService ~ otherShit', otherShit);
    // console.log('🚀 ~ CatsService ~ asyncShit', asyncShit);

    const host = this.configService.get<string>('DATABASE_HOST');
    // console.log('🚀 ~ CatsService ~ host', host);

    const cunt = this.configService.get<string>('SOME_CUNT', 'CUUUUNT');
    // console.log('🚀 ~ CatsService ~ cunt', cunt);

    const port = this.configService.getOrThrow<string>('database.port');
    // console.log('🚀 ~ CatsService ~ port', port);

    const random = this.configService.getOrThrow<string>('database.randomShit');
    // console.log('🚀 ~ CatsService ~ random', random);

    const cats = this.configService.getOrThrow<string>('cats');
    // console.log('🚀 ~ CatsService ~ cats', cats);

    const [some, other] = (() => {
      return [
        this.configService.getOrThrow<string>('cats.some'),
        this.configService.getOrThrow<string>('cats.other'),
      ];
    })();

    // console.log('🚀 ~ CatsService ~ some, other', some, other);

    console.log(catsConfiguration.some);
    console.log(catsConfiguration.other);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.catRepository.find({
      relations: ['words'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const cat = await this.catRepository.findOne({
      where: {
        id: parseInt(id),
      },
      relations: {
        words: true,
      },
    });

    if (!cat) {
      throw new NotFoundException(`Cat with ${id} not found`);
    }

    return cat;
  }

  async create(craeteCatDto: CreateCatDto) {
    const words = await Promise.all(
      craeteCatDto.words.map((name) => this.preloadWordByName(name)),
    );

    const cat = this.catRepository.create({
      ...craeteCatDto,
      words,
    });

    return this.catRepository.save(cat);
  }

  async update(id: string, updateCatDto: UpdateCatDto) {
    const words =
      updateCatDto.words &&
      (await Promise.all(
        updateCatDto.words.map((name) => this.preloadWordByName(name)),
      ));

    const cat = await this.catRepository.preload({
      id: parseInt(id),
      ...updateCatDto,
      words,
    });

    if (!cat) {
      throw new NotFoundException(`Cat #${id} not found`);
    }

    return this.catRepository.save(cat);
  }

  async remove(id: string) {
    const cat = await this.catRepository.findOneBy({
      id: parseInt(id),
    });

    return this.catRepository.remove(cat);
  }

  private async preloadWordByName(name: string): Promise<Word> {
    const existiingWord = await this.wordRepository.findOne({
      where: {
        name,
      },
    });

    if (existiingWord) {
      return existiingWord;
    }

    return this.wordRepository.create({ name });
  }

  async recommendCat(cat: Cat) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      cat.recomendations++;
      const recomendEvent = new Event();
      recomendEvent.name = 'recomended_cat';
      recomendEvent.type = 'cat';
      recomendEvent.payload = { cat: cat.id };

      await queryRunner.manager.save(cat);
      await queryRunner.manager.save(recomendEvent);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
