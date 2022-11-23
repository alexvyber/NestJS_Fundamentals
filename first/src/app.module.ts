import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CatsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // process.env.DATABASE_HOST,
      port: 5432, // parseInt(process.env.DATABASE_PORT),
      username: 'postgres', // process.env.DATABASE_USER,
      password: 'pass123', // process.env.DATABASE_PASSWORD,
      database: 'postgres', // process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
