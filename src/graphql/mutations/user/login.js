import models from '../../../models/index';
import User from '../../types/user';
import UserLoginInput from '../../inputs/userLogin';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import config from '../../../config';

export default {
    type: User,
    args: {
        user: {
            type: UserLoginInput
        }
    },
    resolve (source, args) {
        const { username } = args;

        return models.User.findOne({
                username: username
            }).then((user) => {
            // compare password
            const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 32, 'sha512').toString('hex');

            if (user.password === hash) {
                jwt.sign({username, isAdmin: user.isAdmin}, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                }, (err, token) => res.json({
                    username,
                    isAdmin: user.isAdmin,
                    email: user.email,
                    token
                }));
            }
        });
    }
}