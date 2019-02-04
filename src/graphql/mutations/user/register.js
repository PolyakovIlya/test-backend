import models from '../../../models/index';
import User from '../../types/user';
import UserRegisterInput from '../../inputs/userRegister';
import crypto from "crypto";

export default {
    type: User,
    args: {
        user: {
            type: UserRegisterInput
        }
    },
    async resolve (source, args) {
        const { username, email, password, isAdmin } = args.user;

        const salt = crypto.randomBytes(16).toString('hex');

        const cryptPassword = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha512').toString('hex');

        return await models.User.create({
            username,
            email,
            salt,
            password: cryptPassword,
            isAdmin
        });
    }
}