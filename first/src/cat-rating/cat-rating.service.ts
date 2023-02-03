import { Injectable } from '@nestjs/common';
import { CatsService } from 'src/cats/cats.service';

@Injectable()
export class CatRatingService {
  constructor(private readonly catService: CatsService) {}
}
