import { Router } from 'express';
import models from '../../models/index';
import {init, parsePage} from '../../services';
import permission from '../../middlewares/permission';

const router = Router();

router.get('/', (req, res, next) => {
    models.Article.findAll({
        order: [['createdAt', 'DESC']]
    }).then((articles) => {
        res.json(articles);
    });
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;

    models.Article.findOne({
        where: {
            id
        }
    }).then((article) => {
        res.json(article);
    });
});

router.post('/', permission('admin'), (req, res, next) => {
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
                res.json(article);
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

router.put('/:id', permission('admin'), (req, res, next) => {
    const { id } = req.params;
    const { text, paragraphId } = req.body.article;

    models.Article.findOne({
        where: {
            id
        }
    }).then(article => {
        article.set(`paragraphs.${paragraphId}.paragraph`, text);
        article.save().then((article) => {
            return res.json({article});
        })
    });
});

router.delete('/:id', (req, res, next) => {
    const { id } = req.params;

    models.Article.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.json({
            status: 200,
            id: id,
            message: 'Successfully deleted article'
        });
    });
});

export default router;
