import { Router } from 'express';
import models from '../../models/index';
import {init, parsePage} from "../../services";

const router = Router();

router.get('/', (req, res, next) => {
    models.Article.findAll().then((articles) => {
        res.json(articles);
    });
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    console.log(id)

    models.Article.findOne({
        where: {
            id
        }
    }).then((article) => {
        res.json(article);
    });
});

router.post('/', (req, res, next) => {
    const { url } = req.body.article;
    const parser = init(url);

    parser.then((result) => {
        const data = parsePage(result);

        console.log(data);

        models.Article.create(
            {
                title: data.header,
                url,
                paragraphs: data.paragraphs
            }
        )
            .then((result) => {
                const article = result.get({ plain: true });
                res.json({
                    article
                });
            })
            .catch((err) => {
                res.sendStatus(403).json({
                    success: false,
                    message: err
                });
            });
    }).catch((err) => {
        console.log(err);
    });
});

router.delete('/:id', (req, res, next) => {
    const { id } = req.params;

    models.Article.destroy({
        where: id
    }).then(() => {
        res.json({
            status: 200,
            message: 'Successfully deleted article'
        });
    });
});

router.put('/:id', (req, res, next) => {
    const { id } = req.params;

    models.Article.update(
        {
            paragraph: []
        },
        {
            where: id,
            returning: true,
            plain: true
        }
    )
        .then((article) => {
            res.json({
                article
            });
        })
        .catch((err) => {
            res.sendStatus(403).json({
                success: false,
                message: err
            });
        });
});

export default router;
