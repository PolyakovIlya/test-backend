import { Router } from 'express';
import models from '../../models/index';
import permission from '../../middlewares/permission'

const router = Router();

router.get('/', permission('admin'), (req, res, next) => {
    models.Suggestion.findAll().then((suggestions) => {
        res.json(suggestions);
    });
});

router.get('/:articleId', permission('admin'), (req, res, next) => {
    const { articleId } = req.params;

    models.Suggestion.findAll({
        where: {
            ArticleId: articleId
        },
        include: [{
            model: models.Article
        }]
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
        res.json({
            suggestion
        });
    }).catch((err) => {
        const error = new Error(`Can't create suggestion: ${err}`);
        error.status = 403;
        return next(error);
    });
});

router.delete('/:id', permission('admin'), (req, res, next) => {
    const { id } = req.params;

    models.Suggestion.destroy({
        where: id
    }).then(() => {
        res.json({
            status: 200,
            message: 'Successfully deleted suggestion'
        });
    });
});


router.put('/:id', permission('admin'), (req, res, next) => {
    const { id } = req.params;

    models.Suggestion.update(
        {
            status: ''
        },
        {
            where: id,
            returning: true,
            plain: true
        }
    )
        .then((suggestion) => {
            res.json({
                suggestion
            });
        })
        .catch((err) => {
            const error = new Error(`Can't update suggestion: ${err}`);
            error.status = 403;
            return next(error);
        });
});

export default router;
