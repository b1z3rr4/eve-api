import { Request, Response, NextFunction } from 'express';

/**
 * Middleware class responsible for verifying authentication tokens.
 */
class AuthMiddleware {
    /**
     * Verifies the authorization token provided in the request headers.
     * If the token is valid, it allows the request to proceed to the next middleware or route handler.
     * If the token is invalid or not provided, it responds with a 401 Unauthorized status.
     *
     * @param {Request} req - The incoming request object.
     * @param {Response} res - The response object that will be sent back to the client.
     * @param {NextFunction} next - The next middleware or route handler to be called if authentication succeeds.
     */
    public verifyToken(req: Request, res: Response, next: NextFunction): void {
        const token = req.headers['authorization'];
        if (token === process.env.AUTH_TOKEN) {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    }
}

export default new AuthMiddleware();
