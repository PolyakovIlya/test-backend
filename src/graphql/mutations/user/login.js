import models from '../../../models/index';
import User from '../../types/user';
import UserLoginInput from '../../inputs/userLogin';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../../../config';

export default {
    type: User,
    args: {
        user: {
            type: UserLoginInput
        }
    },
    async resolve (source, args) {
        const { username, password } = args.user;

        const user = await models.User.findOne({username});

        const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 32, 'sha512').toString('hex');

        if (user.password === hash) {
            const token = jwt.sign({username, isAdmin: user.isAdmin}, config.secret, { expiresIn: 86400 }); //24 hours
            return user;
        }
    }
}