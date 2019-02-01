import { Router } from 'express';
import models from '../../models/index';
import permission from '../../middlewares/permission'

const router = Router();

router.get('/', permission('admin'), (req, res, next) => {
    models.Suggestion.find()
        .sort({createdAt: 'desc'})
        .exec()
        .then((suggestions) => {
            res.json(suggestions);
        }).catch((err) => {
            const error = new Error(`Can't get all suggestions: ${err}`);
            return next(error);
        });
});

router.get('/:articleId', permission('admin'), (req, res, next) => {
    const { articleId } = req.params;

    models.Suggestion.find({
        articleId
    }).then((suggestions) => {
            res.json(suggestions);
        }).catch((err) => {
            const error = new Error(`Can't find suggestions by articleId: ${err}`);
            return next(error);
        });
});

router.post('/', (req, res, next) => {
    const { text, articleId, paragraphId, status } = req.body.suggestion;

    models.Suggestion.create({
        text,
        paragraph_id: paragraphId,
        status,
        articleId
    }).then((suggestion) => {
        models.Article.findById(articleId).then(article => {
            if(article && status === 'approved') {
                article.set(`paragraphs.${suggestion.paragraph_id}.paragraph`, suggestion.text);
                article.save().then(() => {
                    return res.status(200).json({
                        suggestion,
                        message: 'Successfully created suggestion and article'
                    });
                })
            } else {
                return res.status(200).json({
                    suggestion,
                    message: 'Successfully created suggestion'
                });
            }
        });

    }).catch((err) => {
        const error = new Error(`Can't create suggestion: ${err}`);
        return next(error);
    });
});

router.put('/:id', permission('admin'), (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    models.Suggestion.findOneAndUpdate(
        {
            _id: id
        },
        {
            status
        },
        { new: true }
        ).then((suggestion) => {
            models.Article.findById(suggestion.articleId).then(article => {
                if(article && status === 'approved') {
                    article.set(`paragraphs.${suggestion.paragraph_id}.paragraph`, suggestion.text);
                    article.save().then(() => {
                        return res.status(200).json({
                            data: suggestion,
                            message: 'Successfully updated suggestion and article'
                        });
                    })
                } else {
                    return res.status(200).json({
                        data: suggestion,
                        message: 'Successfully updated suggestion'
                    });
                }
            });
        })
        .catch((err) => {
            const error = new Error(`Can't update suggestion: ${err}`);
            return next(error);
        });
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
        return next(error);
    });

});

export default router;
