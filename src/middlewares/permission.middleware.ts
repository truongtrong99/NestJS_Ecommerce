import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Factory function to create permission middleware with specific permission
export function createPermissionMiddleware(permission: string) {
    @Injectable()
    class DynamicPermissionMiddleware implements NestMiddleware {
        use(req: Request, res: Response, next: NextFunction) {
            const apiKey = req['apiKey'];

            // Check if apiKey exists in request
            if (!apiKey) {
                throw new ForbiddenException('API Key not found in request');
            }

            // Check if permissions array exists and is not empty
            if (!apiKey.permissions || apiKey.permissions.length === 0) {
                throw new ForbiddenException('No permissions found for this API Key');
            }

            // Check if the required permission is included in the API key's permissions
            if (!apiKey.permissions.includes(permission)) {
                throw new ForbiddenException(`Permission denied. Required permission: ${permission}`);
            }

            next();
        }
    }
    return DynamicPermissionMiddleware;
}
