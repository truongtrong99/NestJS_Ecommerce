// Extend Express Request type to include custom properties
declare namespace Express {
    export interface Request {
        apiKey?: any;
        keyStore?: any;
        user?: any;
        userId?: string;
        refreshToken?: string;
    }
}
