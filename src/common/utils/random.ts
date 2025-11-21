import { createHash, randomBytes, randomInt } from 'node:crypto';

const md5 = (data: unknown) => createHash('md5').update(String(data)).digest('hex');

const generateOtp = (length: number = 5): number => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;

  return randomInt(min, max);
};

const generateToken = (tokenSize: number = 32) => {
  const buffer = randomBytes(tokenSize);
  const token = buffer.toString('base64url');

  return token;
};

const generateRandomString = (stringLength: number = 7) => {
  let result = '';

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let counter = 0; counter < stringLength; counter++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export { md5, generateOtp, generateToken, generateRandomString };
