import { mongooseConfiguration } from './config/configuration.mongodb';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccessModule } from './access/access.module';
import { ApiKeyMiddleware } from './middlewares/apikey.middleware';
import { createPermissionMiddleware } from './middlewares/permission.middleware';
import { ApiKey, ApiKeySchema } from './schemas/apikey.schema';
import { AuthenticationMiddleware } from './middlewares/auth.middleware';
import { Shop, ShopSchema } from './schemas/shop.schema';
import { KeyTokenService } from './services/keyToken.service';
import { KeyToken, KeyTokenSchema } from './schemas/keytoken.schema';
import { ProductModule } from './product/product.module';

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
    JwtModule.register({
      global: true, // Makes JwtService available globally
    }),
    MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }, { name: Shop.name, schema: ShopSchema }, { name: KeyToken.name, schema: KeyTokenSchema }]),
    AccessModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService, KeyTokenService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware, createPermissionMiddleware('0000'), AuthenticationMiddleware)
      .forRoutes('*');
  }
}
