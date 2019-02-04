import {
    GraphQLInt
} from 'graphql';

import models from '../../../models/index.js';
import Article from '../../types/article.js';

export default {
    type: Article,
    args: {
        id: {
            type: GraphQLInt
        }
    },
    resolve(root, args) {
        return models.Article.findById(args.id)
    }
}