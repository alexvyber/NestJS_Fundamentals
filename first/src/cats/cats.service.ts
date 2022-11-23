import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cat } from './entities/cat.entity';

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
  private cats: Cat[] = getCats();

  findAll() {
    return this.cats;
  }

  findOne(id: string) {
    const cat = this.cats.find((i) => i.id === +id);
    if (!cat) {
      throw new NotFoundException(`Cat with ${id} not found`);
    }
    return cat;
  }

  create(craeteCatDto: any) {
    this.cats.push(craeteCatDto);
    return craeteCatDto;
  }

  update(id: string, updateCatDto: any) {
    const existingCat = this.findOne(id);
    if (existingCat) {
      // update existing cat
    }
  }

  remove(id: string) {
    const catIndex = this.cats.findIndex((i) => i.id === +id);
    if (catIndex >= 0) {
      this.cats.splice(catIndex, 1);
    }
  }
}
