import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiKey, ApiKeyDocument } from '../schemas/apikey.schema';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
    constructor(
        @InjectModel(ApiKey.name) private apiKeyModel: Model<ApiKeyDocument>,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const apiKey = req.headers['x-api-key'] as string;

        if (!apiKey) {
            throw new ForbiddenException('API Key is required');
        }

        // Check if API key exists in database
        const existingKey = await this.apiKeyModel.findOne({ key: apiKey, status: true }).lean();

        if (!existingKey) {
            throw new ForbiddenException('Invalid API Key');
        }

        // Attach API key data to request for later use
        req['apiKey'] = existingKey;

        next();
    }
}
