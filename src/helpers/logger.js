import winston from 'winston';

export default winston.createLogger({
    level: (process.env.NODE_ENV === 'production') ? 'info' : 'debug',
    timestamp: true,
    stderrLevels: ['error'],
    colorize: true,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combine.log' })
    ]
});
