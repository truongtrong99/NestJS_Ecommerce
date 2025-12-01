import { JwtService } from '@nestjs/jwt';

// This function is meant to be used with JwtService injected
// For usage in services, inject JwtService and use:
// jwtService.sign(payload, { secret: privateKey, algorithm: 'RS256', expiresIn: '2d' })

const createTokenPair = async (jwtService: JwtService, payload: any, publicKey: string, privateKey: string) => {
    try {
        // create access token
        const accessToken = jwtService.sign(payload, {
            secret: privateKey,
            algorithm: 'RS256',
            expiresIn: '2 days'
        });

        // create refresh token
        const refreshToken = jwtService.sign(payload, {
            secret: privateKey,
            algorithm: 'RS256',
            expiresIn: '7 days'
        });

        // verify token (optional validation)
        try {
            jwtService.verify(accessToken, {
                secret: publicKey,
                algorithms: ['RS256']
            });
        } catch (err) {
            console.error('Error verifying access token:', err);
        }

        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
}

export {
    createTokenPair
}