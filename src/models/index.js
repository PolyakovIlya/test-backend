import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import config from '../config/index';
import logger from '../helpers/logger';
import _ from 'lodash';

// postgres setup
if (config.dbname === process.env.POSTGRESURI && !config.pass) logger.warn(`bad credientials for ${config.dbname} -- check env.`);

const sequelize = new Sequelize(config.dbname, config.user, config.pass, {
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false, // disable aliases
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .then(() => {
        logger.info('Connection has been established successfully.');
    })
    .catch((err) => {
        logger.warn('Unable to connect to the database: ', err);
    });

// load each model
let models = Object.assign({}, ...fs.readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
    .map((file) => {
        const model = require(path.join(__dirname, file)); // eslint-disable-line global-require
        return {
            [model.default.name]: model.default.init(sequelize)
        };
    }));

_.values(models)
    .filter(model => typeof model.associate === "function")
    .forEach(model => model.associate(models));

sequelize
    .sync()
    // .sync({force: true})
    .then(() => {
        logger.info('success sync');
    }, (err) => {
        logger.warn('error sync: ', err);
    });

const db = {
    ...models,
    sequelize
};

module.exports = db;
