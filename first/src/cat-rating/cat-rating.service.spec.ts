import { Test, TestingModule } from '@nestjs/testing';
import { CatRatingService } from './cat-rating.service';

describe('CatRatingService', () => {
  let service: CatRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatRatingService],
    }).compile();

    service = module.get<CatRatingService>(CatRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
