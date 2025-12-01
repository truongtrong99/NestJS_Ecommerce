import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Shop, ShopDocument } from '../schemas/shop.schema';
import { KeyTokenService } from '../services/keyToken.service';

// Define HEADER constants
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-rtoken-id'
};

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(
        @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
        private keyTokenService: KeyTokenService,
        private jwtService: JwtService,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            /*
            1. Check userId (client-id) in header
            2. Get access token from authorization header
            3. Verify access token
            4. Check if user exists in database
            5. Check keystore with userId
            6. Return next() if everything is valid
            */

            // 1. Check userId from header
            const userId = req.headers[HEADER.CLIENT_ID] as string;

            if (!userId) {
                throw new UnauthorizedException('Invalid Request: Missing userId');
            }

            // 2. Get keystore by userId
            const keyStore = await this.keyTokenService.findByUserId(userId);

            if (!keyStore) {
                throw new ForbiddenException('Invalid Request: KeyStore not found');
            }

            // 3. Get access token from authorization header
            const accessToken = req.headers[HEADER.AUTHORIZATION] as string;

            if (!accessToken) {
                throw new UnauthorizedException('Invalid Request: Missing access token');
            }

            // 4. Verify access token
            try {
                const decodeUser = this.jwtService.verify(accessToken, {
                    secret: keyStore.privateKey,
                });

                // Check if token payload contains userId
                if (decodeUser['userId'] !== userId) {
                    throw new UnauthorizedException('Invalid User');
                }                // 5. Check if user exists in database
                const user = await this.shopModel.findById(userId).lean();

                if (!user) {
                    throw new ForbiddenException('User not found');
                }

                // Attach decoded user and keystore to request for later use
                req['keyStore'] = keyStore;
                req['user'] = decodeUser;
                req['userId'] = userId;

                next();
            } catch (error) {
                throw new UnauthorizedException('Invalid or expired access token');
            }

        } catch (error) {
            next(error);
        }
    }
}
