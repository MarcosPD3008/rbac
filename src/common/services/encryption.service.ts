import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class EncryptionService {
  /**
   * Hashes a plain text password using argon2
   * @param plainPassword The plain text password
   * @returns The hashed password
   */
  async hashPassword(plainPassword: string): Promise<string> {
    try {
      return await argon2.hash(plainPassword);
    } 
    catch (error) {
      throw new Error('Error hashing password');
    }
  }

  /**
   * Verifies a plain text password against a hashed password
   * @param plainPassword The plain text password
   * @param hashedPassword The hashed password
   * @returns True if the password matches, false otherwise
   */
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } 
    catch (error) {
      throw new Error('Error verifying password');
    }
  }
}
