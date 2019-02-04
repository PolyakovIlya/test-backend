import models from '../../../models/index';
import Article from '../../types/article';
import ArticleInput from '../../inputs/article';

export default {
    type: Article,
    args: {
        article: {
            type: ArticleInput
        }
    },
    resolve (source, args) {
        return (
            models.Article.create({
                title: args.title,
                url: args.url,
                paragraphs: args.paragraphs
            })
        );
    }
}