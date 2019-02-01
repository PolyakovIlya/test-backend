import { Router } from 'express';
import models from '../../models/index';
import {init, parsePage} from '../../services';
import permission from '../../middlewares/permission';

const router = Router();

router.get('/', (req, res, next) => {
    let page = parseInt(req.query.page);
    let limit = 3;
    let offset = limit * (page - 1);

    models.Article.find()
        .sort({createdAt: 'desc'})
        .limit(limit)
        .skip(offset)
        .exec()
        .then((articles) => {
            models.Article.countDocuments()
                .exec()
                .then(count => {
                    let pages = Math.ceil(count / limit);
                    offset = limit * (page - 1);

                    res.json({
                        articles,
                        meta: {
                            count,
                            page,
                            pages
                        }
                    });
                })
        }).catch((err) => {
            const error = new Error(`Can't get all articles: ${err}`);
            return next(error);
        });
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;

    models.Article.findById(id).then((article) => {
        res.json(article);
    }).catch((err) => {
        const error = new Error(`Can't get article by id: ${err}`);
        return next(error);
    });
});

router.post('/', permission('admin'), (req, res, next) => {
    const { url } = req.body.article;
    const parser = init(url);

    parser.then((result) => {
        const data = parsePage(result);

        const article = new models.Article({
            title: data.header,
            url,
            paragraphs: data.paragraphs
        });

        article.save()
            .then((article) => {
                res.json(article);
            })
            .catch((err) => {
                const error = new Error(`Can't create article: ${err}`);
                return next(error);
            });
    }).catch((err) => {
        const error = new Error(`Can't parse news article: ${err}`);
        return next(error);
    });
});

router.put('/:id', permission('admin'), (req, res, next) => {
    const { id } = req.params;
    const { text, paragraphId } = req.body.article;

    models.Article.findById(id).then(article => {
        article.set(`paragraphs.${paragraphId}.paragraph`, text);
        article.save().then((article) => {
            return res.json({article});
        })
    }).catch((err) => {
        const error = new Error(`Can't update article: ${err}`);
        return next(error);
    });
});

router.delete('/:id', (req, res, next) => {
    const { id } = req.params;

    models.Article.findOneAndDelete(id).then(() => {
        res.status(200).json({
            id: id,
            message: 'Successfully deleted article'
        });
    }).catch((err) => {
        const error = new Error(`Can't delete article: ${err}`);
        return next(error);
    });
});

export default router;
