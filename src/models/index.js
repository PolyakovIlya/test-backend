import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import config from '../config/index';
import logger from '../helpers/logger';
import _ from 'lodash';

class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(`mongodb://${config.dburi}/${config.dbname}`)
            .then(() => {
                logger.info('Database connection successful');
            })
            .catch(err => {
                logger.warn('Database connection error');
            })
    }
}

module.exports = new Database();
