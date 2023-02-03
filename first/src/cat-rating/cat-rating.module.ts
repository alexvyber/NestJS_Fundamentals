import { Module } from '@nestjs/common';
import { CatsModule } from 'src/cats/cats.module';
import { CatRatingService } from './cat-rating.service';

@Module({
  imports: [CatsModule],
  providers: [CatRatingService],
})
export class CatRatingModule {}
