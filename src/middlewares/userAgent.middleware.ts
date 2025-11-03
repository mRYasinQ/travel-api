import type { RequestHandler } from 'express';
import { UAParser } from 'ua-parser-js';

const userAgentParser: RequestHandler = (req, _res, next) => {
  const userAgentString = req.headers['user-agent'] ?? 'unknown';
  const userAgent = UAParser(userAgentString);

  req.userAgent = userAgent;

  return next();
};

export default userAgentParser;
