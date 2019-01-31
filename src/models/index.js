import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import config from '../config/index';
import logger from '../helpers/logger';

mongoose.connect(`mongodb://${config.dburi}/${config.dbname}`,
    {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => {
        logger.info('Database connection successful');
    })
    .catch(err => {
        logger.warn('Database connection error');
    });

let models = Object.assign({}, ...fs.readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
    .map((file) => {
        const model = require(path.join(__dirname, file)); // eslint-disable-line global-require
        return {
            [model.default.name]: model
        };
    }));

const db = {
    ...models,
    mongoose
};

module.exports = db;
