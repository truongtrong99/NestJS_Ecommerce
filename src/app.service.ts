import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
