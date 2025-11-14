import { compare, hash } from 'bcryptjs';

const hashPassword = async (password: string) => {
  const hashedPassword = await hash(password, 10);
  return hashedPassword;
};

const comparePassword = async (password: string, hashedPassword: string) => {
  const result = await compare(password, hashedPassword);
  return result;
};

export { hashPassword, comparePassword };
