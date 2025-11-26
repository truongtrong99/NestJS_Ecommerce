import { Module } from '@nestjs/common';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from 'src/schemas/shop.schema';
import { JwtService } from '@nestjs/jwt';
import { KeyTokenService } from 'src/services/keyToken.service';
import { KeyToken, KeyTokenSchema } from 'src/schemas/keytoken.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }, { name: KeyToken.name, schema: KeyTokenSchema }])],
  controllers: [AccessController],
  providers: [AccessService, JwtService, KeyTokenService],
})
export class AccessModule { }
