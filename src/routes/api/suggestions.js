import { Router } from 'express';
import models from '../../models/index';
import permission from '../../middlewares/permission'

const router = Router();

router.get('/', permission('admin'), (req, res, next) => {
    models.Suggestion.findAll({
        order: [['createdAt', 'DESC']]
    }).then((suggestions) => {
        res.json(suggestions);
    }).catch((err) => {
        const error = new Error(`Can't get all suggestions: ${err}`);
        error.status = 403;
        return next(error);
    });
});

router.get('/:articleId', permission('admin'), (req, res, next) => {
    const { articleId } = req.params;

    models.Suggestion.findAll({
        where: {
            ArticleId: articleId
        }
    }).then((suggestions) => {
        res.json(suggestions);
    }).catch((err) => {
        const error = new Error(`Can't find suggestions by articleId: ${err}`);
        error.status = 403;
        return next(error);
    });
});

router.post('/', (req, res, next) => {
    const { text, articleId, paragraphId, status } = req.body.suggestion;

    models.Suggestion.create({
        text,
        paragraph_id: paragraphId,
        status,
        ArticleId: articleId
    }).then((suggestion) => {
        models.Article.findOne({
            where: {
                id: suggestion.ArticleId
            }
        }).then(article => {
            if(article && status === 'approved') {
                article.set(`paragraphs.${suggestion.paragraph_id}.paragraph`, suggestion.text);
                article.save().then(() => {
                    return res.json({
                        status: 200,
                        suggestion,
                        message: 'Successfully created suggestion and article'
                    });
                })
            } else {
                return res.json({
                    status: 200,
                    suggestion,
                    message: 'Successfully created suggestion'
                });
            }
        });

    }).catch((err) => {
        const error = new Error(`Can't create suggestion: ${err}`);
        error.status = 403;
        return next(error);
    });
});

router.put('/:id', permission('admin'), (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    models.Suggestion.update(
        {
            status: status
        },
        {
            where: {id: id},
            returning: true,
            plain: true
        }).then((result) => {
            const suggestion = result[1].dataValues;

            models.Article.findOne({
                where: {
                    id: suggestion.ArticleId
                }
            }).then(article => {
                if(article && status === 'approved') {
                    article.set(`paragraphs.${suggestion.paragraph_id}.paragraph`, suggestion.text);
                    article.save().then(() => {
                        return res.json({
                            status: 200,
                            data: suggestion,
                            message: 'Successfully updated suggestion and article'
                        });
                    })
                } else {
                    return res.json({
                        status: 200,
                        data: suggestion,
                        message: 'Successfully updated suggestion'
                    });
                }
            });
        })
        .catch((err) => {
            const error = new Error(`Can't update suggestion: ${err}`);
            error.status = 403;
            return next(error);
        });
});

router.delete('/:id', permission('admin'), (req, res, next) => {
    const { id } = req.params;

    models.Suggestion.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.json({
            status: 200,
            id: id,
            message: 'Successfully deleted suggestion'
        });
    }).catch((err) => {
        const error = new Error(`Can't delete suggestion: ${err}`);
        error.status = 403;
        return next(error);
    });

});

export default router;
