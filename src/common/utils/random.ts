import crypto from 'node:crypto';

const generateOtp = (length: number = 5): number => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;

  return crypto.randomInt(min, max);
};

export { generateOtp };
