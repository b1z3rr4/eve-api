import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token for authentication.
 *
 * @returns {string} - The generated JWT token.
 */
export function generateToken(): string {
    const secret = process.env.JWT_SECRET || 'default_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    return jwt.sign({ }, secret, { expiresIn });
}
