import { Router } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import models from '../../models/index';
import config from '../../config/index';

const router = Router();

router.get('/user/:id', (req, res, next) => {
    const { id } = req.params;

    models.User.findById(id).then((user) => {
        res.json(user);
    }).catch((err) => {
        const error = new Error(`Can't find required user: ${err}`);
        return next(error);
    });
});

router.get('/users', (req, res, next) => {
    models.User.find().then((users) => {
        res.json(users);
    }).catch((err) => {
        const error = new Error(`Can't get all users: ${err}`);
        return next(error);
    });
});

router.post('/users/login', (req, res, next) => {
    const { username, password } = req.body.user;

    models.User.findOne({
        username: username
    }).then((user) => {
        // compare password
        const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 32, 'sha512').toString('hex');

        if (user.password === hash) {
            jwt.sign({ username, isAdmin: user.isAdmin }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            }, (err, token) => res.json({
                username,
                isAdmin: user.isAdmin,
                email: user.email,
                token
            }));
        }

        const error = new Error('Incorrect username or password');
        return next(error);
    }).catch(() => {
        const error = new Error('Authentication failed! Please check the request');
        return next(error);
    });
});

router.post('/users/register', (req, res, next) => {
    const { username, email, isAdmin } = req.body.user;

    const salt = crypto.randomBytes(16).toString('hex');
    const password = crypto.pbkdf2Sync(req.body.user.password, salt, 10000, 32, 'sha512').toString('hex');

    const user = new models.User({
        username,
        email,
        salt,
        password,
        isAdmin
    });

    user.save()
        .then((user) => {
            if (user) {
                res.json(user);
            } else {
                const error = new Error('Can\'t create user');
                return next(error);
            }
        }).catch(() => {
            const error = new Error('Can\'t find or create user');
            return next(error);
        });
});

export default router;
