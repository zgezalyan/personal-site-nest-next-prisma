import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

function parseCorsOrigins(): string | string[] | boolean {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (!raw) {
    return true;
  }
  const list = raw.split(',').map((s) => s.trim()).filter(Boolean);
  if (list.length === 0) {
    return true;
  }
  return list.length === 1 ? list[0] : list;
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.use(helmet());
  app.use(cookieParser());

  app.enableCors({
    origin: parseCorsOrigins(),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
 
  app.enableShutdownHooks();

  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port);
  logger.log(`API listening on http://localhost:${port}`);
}
bootstrap();
