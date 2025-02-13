
/**
 * Interface representing a strategy for managing a token blacklist.
 */
export interface TokenBlacklistStrategy {
    /**
     * Adds a token to the blacklist with an expiration time.
     * 
     * @param token - The token to be blacklisted.
     * @param expiresAt - The expiration time of the token in milliseconds since the Unix epoch.
     * @returns A promise that resolves when the token has been added.
     */
    addToken(token: string, expiresAt: number): Promise<void>;
  
    /**
     * Checks if a token is blacklisted.
     * 
     * @param token - The token to check.
     * @returns A promise that resolves to a boolean indicating whether the token is blacklisted.
     */
    isBlacklisted(token: string): Promise<boolean>;
  
    /**
     * Optional method to clean up expired tokens from the blacklist.
     * This method is particularly useful for implementations using Redis.
     * 
     * @returns A promise that resolves when the cleanup is complete.
     */
    cleanUpExpiredTokens?(): Promise<void>;
  }