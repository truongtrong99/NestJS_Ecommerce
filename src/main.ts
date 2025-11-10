import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { checkOverLoad, countConnections } from './helpers/check.connect';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(compression());
  // checkOverLoad();
  // countConnections();
  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
