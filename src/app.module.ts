import { mongooseConfiguration } from './config/configuration.mongodb';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessModule } from './access/access.module';
import { ApiKeyMiddleware } from './middlewares/apikey.middleware';
import { createPermissionMiddleware } from './middlewares/permission.middleware';
import { ApiKey, ApiKeySchema } from './schemas/apikey.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return mongooseConfiguration(configService)
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: [
          `.env.test.local`,
          `.env.prod.local`,
          '.env'
        ]
      }
    ),
    MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }]),
    AccessModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware, createPermissionMiddleware('0000'))
      .forRoutes('*');
  }
}
