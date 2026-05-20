import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. HTTP security headers via helmet
  app.use(helmet());

  // 2. CORS configuration restricted to the frontend URL
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // 3. Global validation pipe for strict DTO checking
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // strip non-whitelisted properties
      forbidNonWhitelisted: true, // reject requests with non-whitelisted properties
      transform: true,            // automatically transform payload types
    }),
  );

  await app.listen(process.env.PORT || 3002);
}
bootstrap();
