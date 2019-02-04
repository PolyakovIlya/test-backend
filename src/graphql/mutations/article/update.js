import {
    GraphQLInt, GraphQLString
} from 'graphql';

import models from '../../../models/index';
import Article from '../../types/article';

export default {
    type: Article,
    args: {
        id: {
            type: GraphQLInt
        },
        text: {
            type: GraphQLString
        },
        paragraph_id: {
            type: GraphQLInt
        }
    },
    resolve (source, args) {
        return models.Article.findById(args.id).then(article => {
            article.set(`paragraphs.${args.paragraph_id}.paragraph`, args.text);
            article.save();
        });
    }
}