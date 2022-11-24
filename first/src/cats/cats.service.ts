import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cat } from './entities/cat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Word } from './entities/word.entity';
import { PaginationQueryDto } from 'src/common/dto/paginationquery.dto';
import { Event } from 'src/evenst/entities/event.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
    private readonly connection: Connection,
  ) {}

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
