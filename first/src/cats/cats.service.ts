import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cat } from './entities/cat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Word } from './entities/word.entity';

const getCats = (): Cat[] => {
  return [...Array(10)].map((item, index) => ({
    id: index,
    name: `Name ${item}`,
    stupid: Math.random() > 0.5 ? true : false,
    active: Math.random() > 0.5 ? true : false,
    words: ['some', 'other'],
  }));
};

@Injectable()
export class CatsService {
  // private cats: Cat[] = getCats();

  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
  ) {}

  findAll() {
    return this.catRepository.find({
      relations: ['words'],
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
}
