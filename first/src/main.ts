import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
// import { ApiKeyGuard } from './common/guards/api-key/api-key.guard';
import { WrapResponeInterceptor } from './common/interceptors/wrap-respone/wrap-respone.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(
    new WrapResponeInterceptor(),
    new TimeoutInterceptor(),
  );

  // app.useGlobalGuards(new ApiKeyGuard());

  await app.listen(3000);
}
bootstrap();
