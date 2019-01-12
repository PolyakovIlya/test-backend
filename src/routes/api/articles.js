import { Router } from 'express';
import models from '../../models/index';
import {init, parsePage} from '../../services';
import permission from '../../middlewares/permission';

const router = Router();

router.get('/', (req, res, next) => {
    let page = parseInt(req.query.page);
    let limit = 3;
    let offset = page * limit;

    models.Article.findAndCountAll({
        attributes: ['id', 'title', 'url', 'paragraphs', 'createdAt'],
        limit: limit,
        offset: offset - 1,
        $sort: { id: 1 },
        order: [['createdAt', 'DESC']]
    }).then((articles) => {
        let pages = Math.ceil(articles.count / limit);
        offset = limit * (page - 1);

        res.json({
            articles: articles.rows,
            meta: {
                count: articles.count,
                page: page,
                pages: pages
            }
        });
    }).catch((err) => {
        const error = new Error(`Can't get all articles: ${err}`);
        error.status = 403;
        return next(error);
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
    }).catch((err) => {
        const error = new Error(`Can't get article by id: ${err}`);
        error.status = 403;
        return next(error);
    });
});

router.post('/', permission('admin'), (req, res, next) => {
    const { url } = req.body.article;
    const parser = init(url);

    parser.then((result) => {
        const data = parsePage(result);

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
                const error = new Error(`Can't create article: ${err}`);
                error.status = 403;
                return next(error);
            });
    }).catch((err) => {
        const error = new Error(`Can't parse news article: ${err}`);
        error.status = 403;
        return next(error);
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
    }).catch((err) => {
        const error = new Error(`Can't update article: ${err}`);
        error.status = 403;
        return next(error);
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
    }).catch((err) => {
        const error = new Error(`Can't delete article: ${err}`);
        error.status = 403;
        return next(error);
    });
});

export default router;
