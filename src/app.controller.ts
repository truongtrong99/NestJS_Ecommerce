import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    const compression = 'compression enabled';
    return compression.repeat(100000) + this.appService.getHello();
  }
}
