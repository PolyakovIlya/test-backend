import jwt from 'jsonwebtoken';
import _ from 'lodash';
import config from '../config';

export default (req, res, next) => {
    const token = req.body.token || req.params.token || req.headers['x-access-token'] || req.cookies.token;


    const excludeRoutes = ['/api/users/login', '/api/users/register', '/'];

    if (_.includes(excludeRoutes, req.path)) return next();

    if (token) {
        try {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    const error = new Error('Token is not valid');
                    error.status = 422;
                    return next(error);
                }
                req.decoded = decoded;
                next();
            });
        } catch (err) {
            return next();
        }
    } else {
        const error = new Error('Auth token is not supplied');
        error.status = 401;
        return next(error);
    }
};
