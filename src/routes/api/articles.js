import { Router } from 'express';
import models from '../../models/index';
import {init, parsePage} from '../../services';
import permission from '../../middlewares/permission';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        let page = parseInt(req.query.page);
        let limit = 3;
        let offset = limit * (page - 1);

        const articles = await models.Article.find()
            .sort({createdAt: 'desc'})
            .limit(limit)
            .skip(offset)
            .exec();

        const count = await models.Article.countDocuments().exec();

        let pages = Math.ceil(count / limit);

        res.json({
            articles,
            meta: {
                count,
                page,
                pages
            }
        });
    } catch (err) {
        const error = new Error(`Can't get all articles: ${err}`);
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = await models.Article.findById(id);

        res.json(article);
    } catch (err) {
        const error = new Error(`Can't get article by id: ${err}`);
        next(error);
    }
});

router.post('/', permission('admin'), async (req, res, next) => {
    try {
        const { url } = req.body.article;
        const result = await init(url);

        const data = parsePage(result);

        const article = await models.Article.create({
            title: data.header,
            url,
            paragraphs: data.paragraphs
        });

        res.json(article);
    } catch (err) {
        const error = new Error(`Can't parse news article: ${err}`);
        next(error);
    }
});

router.put('/:id', permission('admin'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { text, paragraphId } = req.body.article;

        const articleById = await models.Article.findById(id);

        articleById.set(`paragraphs.${paragraphId}.paragraph`, text);
        const article = await articleById.save();

        res.json({article});

    } catch (err) {
        const error = new Error(`Can't update article: ${err}`);
        next(error);
    }
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
        next(error);
    });
});

export default router;
