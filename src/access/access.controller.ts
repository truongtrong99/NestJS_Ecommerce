import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AccessService } from './access.service';
import { SignupDTO } from 'src/dto/signup.dto';

@Controller('v1/api/shop')
export class AccessController {
    constructor(private readonly accessService: AccessService) { }
    @Post('signup')
    async signup(@Body() signup: SignupDTO) {
        const results = await this.accessService.signUp(signup);
        return results;
    }

    @Post('login')
    async login(@Body() loginDto: { email: string; password: string; refreshToken?: string | null }) {
        const results = await this.accessService.login(loginDto);
        return results;
    }

    @Post('logout')
    async logout(@Req() req: Request) {
        const results = await this.accessService.logout(req['keyStore']);
        return results;
    }
}
