import { Body, Controller, Param, Post } from '@nestjs/common';
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
}
