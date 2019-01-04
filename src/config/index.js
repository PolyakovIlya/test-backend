import path from 'path';

export default {
    // address of postegre
    dburi: process.env.POSTGRESURI || 'localhost:5432',
    dbname: 'postgres_db',
    user: process.env.DB_USER || 'admin',
    pass: process.env.DB_PASS || 'admin',

    // environment
    env: process.env.NODE_ENV || 'development',

    // port on which to listen
    port: process.env.PORT || 3001,

    // path to root directory of this app
    root: path.normalize(__dirname),

    // jwt token secret
    secret: 'aAbBcCdD!',

    //news source
    newsUrl: 'https://www.dagbladet.no'
};
