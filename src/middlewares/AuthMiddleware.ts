import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            next();
        });
    }
}

export default new AuthMiddleware();
