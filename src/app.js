import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

import middlewares from './middlewares';
import routes from './routes/index';

import config from './config/index';
import logger from './helpers/logger';

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compress());
app.use(cookieParser());
app.use(helmet());
app.use(middlewares);
// app.use(models);
// set all routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    const sc = err.status || 500;
    res.status(sc);
    res.send({
        error: {
            status: sc,
            message: err.message
            // stack: config.env === 'development' ? err.stack : ''
        }
    });
});

const server = app.listen(config.port, () => {
    logger.info(`listening on port ${config.port}`);
});

process.on('SIGINT', () => {
    logger.info('shutting down!');
    server.close();
    process.exit();
});
