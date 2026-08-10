import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import { allowedOrigins, isDevelopment } from './config/cors';

export const PORT = process.env.PORT || 3000;
export const HOST = process.env.HOST || (process.env.NODE_ENV === 'production' ? '127.0.0.1' : '0.0.0.0');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors(
    isDevelopment
      ? {
          origin: true,
        }
      : {
          origin: allowedOrigins,
          credentials: true,
        },
  );

  await app.listen(PORT, HOST, () => {
    console.log('Server started on: ', PORT);
    console.log('API URL: ', `http://${HOST}:${PORT}/`);
    if (!isDevelopment) console.log('Allowed origins: ', allowedOrigins.join(', ') || '(none configured)');
  });
}
bootstrap();
