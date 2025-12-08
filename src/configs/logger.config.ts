import path from 'node:path';
import { createLogger, format, transports } from 'winston';

const { NODE_ENV } = process.env;

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf((info) => `[${info.timestamp}] [${info.level}]: ${info.message}`),
  ),
  transports: [new transports.Console()],
});

if (NODE_ENV === 'production') {
  logger.add(new transports.File({ filename: path.join(process.cwd(), 'logs', 'app.log') }));
}

export default logger;
