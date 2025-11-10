import { mongooseConfiguration } from './config/configuration.mongodb';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    )
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
