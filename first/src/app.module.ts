import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatRatingModule } from './cat-rating/cat-rating.module';
// import { DatashitModule } from './datashit/datashit.module'; // example
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';
import { appConfig } from './config/app.config';

const envSchema = z
  .object({
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.string().default('5432'),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
    RANDOM_SHIT: z.string(),
  })
  .required();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        // host: 'localhost', // process.env.DATABASE_HOST,
        // port: 5432, // parseInt(process.env.DATABASE_PORT),
        // username: 'postgres', // process.env.DATABASE_USER,
        // password: 'pass123', // process.env.DATABASE_PASSWORD,
        // database: 'postgres', // process.env.DATABASE_NAME,

        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    // DatashitModule.register({
    //   port: 2134,
    //   type: 'postgres',
    //   host: 'localhost',
    //   password: 'somePasdfasdf1234asfd',
    // }),
    CatsModule,
    ConfigModule.forRoot({
      validationSchema: envSchema,
      validate: (envs) => envSchema.parse(envs),
      load: [appConfig],
    }),

    CatRatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

const randomShit = process.env.RANDOM_SHIT;
console.log('🚀 ~ randomShit', randomShit);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
