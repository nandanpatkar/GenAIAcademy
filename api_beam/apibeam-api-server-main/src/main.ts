import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import {
  allowedOrigins,
  allowAnyChromeExtensionOrigin,
  isDevelopment,
  isAllowedOrigin,
} from './config/cors';

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
          origin: (origin, callback) => {
            if (isAllowedOrigin(origin)) {
              callback(null, true);
              return;
            }
            callback(new Error('Origin is not allowed'));
          },
          credentials: true,
        },
  );

  await app.listen(PORT, HOST, () => {
    console.log('Server started on: ', PORT);
    console.log('API URL: ', `http://${HOST}:${PORT}/`);
    if (!isDevelopment) console.log('Allowed origins: ', allowedOrigins.join(', ') || '(none configured)');
    if (allowAnyChromeExtensionOrigin) {
      console.warn(
        'ALLOW_ANY_CHROME_EXTENSION_ORIGIN is enabled: any Chrome extension origin may connect. Use only for temporary testing until device-token pairing is implemented.',
      );
    }
  });
}
bootstrap();
