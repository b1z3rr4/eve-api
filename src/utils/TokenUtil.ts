import { randomBytes } from 'crypto';

/**
 * Generates a secure random token as a hexadecimal string.
 * The token is 32 bytes long, which results in a 64-character hexadecimal string.
 *
 * @returns {string} - A 64-character hexadecimal string representing the generated token.
 */
export function generateToken(): string {
    return randomBytes(32).toString('hex');
}
