import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const format = 'hex';
const keyLength = 64;
const separator = ':';

export class Token {
  static hash(token: string) {
    const salt = randomBytes(16).toString(format);
    const buf = scryptSync(token, salt, keyLength);

    return `${buf.toString(format)}${separator}${salt}`;
  }

  static compare(storedToken: string, suppliedToken: string) {
    const [hashedToken, salt] = storedToken.split(separator);
    const hashedTokenBuf = Buffer.from(hashedToken, format);
    const buf = scryptSync(suppliedToken, salt, keyLength);

    return timingSafeEqual(hashedTokenBuf, buf);
  }
}
