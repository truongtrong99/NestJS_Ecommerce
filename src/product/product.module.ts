import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductFactoryService } from './productFactory.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/product/product.schema';
import { Electronic, ElectronicSchema } from 'src/schemas/product/electronic.schema';
import { Clothing, ClothingSchema } from 'src/schemas/product/clothing.schema';
import { ClothingService } from './services/clothing.service';
import { ProductService } from './services/product.service';
import { ElectronicService } from './services/electronic.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema },
    { name: Electronic.name, schema: ElectronicSchema },
    { name: Clothing.name, schema: ClothingSchema }
  ]
  )],
  controllers: [ProductController],
  providers: [ProductFactoryService, ClothingService, ProductService, ElectronicService],
})
export class ProductModule { }
