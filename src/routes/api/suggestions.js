import { Router } from 'express';
import models from '../../models/index';
import permission from '../../middlewares/permission'

const router = Router();

router.get('/', permission('admin'), async (req, res, next) => {
    try {
        const suggestions = await models.Suggestion.find()
            .sort({createdAt: 'desc'})
            .exec();

        res.json(suggestions);
    } catch (err) {
        const error = new Error(`Can't get all suggestions: ${err}`);
        next(error);
    }
});

router.get('/:articleId', permission('admin'), async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const suggestions = await models.Suggestion.find({articleId});

        res.json(suggestions);
    } catch (err) {
        const error = new Error(`Can't find suggestions by articleId: ${err}`);
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { text, articleId, paragraphId, status } = req.body.suggestion;

        const suggestion = await models.Suggestion.create({
            text,
            paragraph_id: paragraphId,
            status,
            articleId
        });

        const article = await models.Article.findById(articleId);

        if(article && status === 'approved') {
            article.set(`paragraphs.${suggestion.paragraph_id}.paragraph`, suggestion.text);
            article.save().then(() => {
                res.status(200).json({
                    suggestion,
                    message: 'Successfully created suggestion and article'
                });
            })
        } else {
            res.status(200).json({
                suggestion,
                message: 'Successfully created suggestion'
            });
        }

    } catch (err) {
        const error = new Error(`Can't create suggestion: ${err}`);
        next(error);
    }
});

router.put('/:id', permission('admin'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const suggestion = await models.Suggestion.findOneAndUpdate({ _id: id }, { status }, { new: true });

        const article = await models.Article.findById(suggestion.articleId);

        if(article && status === 'approved') {
            article.set(`paragraphs.${suggestion.paragraph_id}.paragraph`, suggestion.text);
            article.save().then(() => {
                res.status(200).json({
                    data: suggestion,
                    message: 'Successfully updated suggestion and article'
                });
            })
        } else {
            res.status(200).json({
                data: suggestion,
                message: 'Successfully updated suggestion'
            });
        }
    } catch (err) {
        const error = new Error(`Can't update suggestion: ${err}`);
        next(error);
    }
});

router.delete('/:id', permission('admin'), (req, res, next) => {
    const { id } = req.params;

    models.Suggestion.findOneAndDelete(id).then(() => {
        res.status(200).json({
            id: id,
            message: 'Successfully deleted suggestion'
        });
    }).catch((err) => {
        const error = new Error(`Can't delete suggestion: ${err}`);
        next(error);
    });

});

export default router;
