import { Router } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import models from '../../models/index';
import config from '../../config/index';

const router = Router();

router.get('/user/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await models.User.findById(id);
        res.json(user);
    } catch (err) {
        const error = new Error(`Can't find required user: ${err}`);
        next(error);
    }
});

router.get('/users', async (req, res, next) => {
    try {
        const users = await models.User.find();
        res.json(users);
    } catch (err) {
        const error = new Error(`Can't get all users: ${err}`);
        next(error);
    }
});

router.post('/users/login', async (req, res, next) => {
    try {
        const { username, password } = req.body.user;
        const user = await models.User.findOne({ username });

        const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 32, 'sha512').toString('hex');

        if (user.password === hash) {
            const token = await jwt.sign({ username, isAdmin: user.isAdmin }, config.secret, { expiresIn: 86400 }); // 24 hours

            res.json({
                username,
                isAdmin: user.isAdmin,
                email: user.email,
                token
            })
        } else {
            const error = new Error('Incorrect username or password');
            next(error);
        }
    } catch (err) {
        const error = new Error('Authentication failed! Please check the request');
        next(error);
    }
});

router.post('/users/register', async (req, res, next) => {
    try {
        const { username, email, isAdmin } = req.body.user;

        const salt = crypto.randomBytes(16).toString('hex');
        const password = crypto.pbkdf2Sync(req.body.user.password, salt, 10000, 32, 'sha512').toString('hex');

        const user = await models.User.create({
            username,
            email,
            salt,
            password,
            isAdmin
        });

        if (user) {
            res.json(user);
        } else {
            const error = new Error('Can\'t create user');
            next(error);
        }
    } catch(err) {
        const error = new Error('Can\'t find or create user');
        next(error);
    }
});

export default router;
