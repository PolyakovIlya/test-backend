import {
    GraphQLInt,
} from 'graphql';

import models from '../../../models/index';
import Article from '../../types/article';

export default {
    type: Article,
    args: {
        id: {
            type: GraphQLInt
        }
    },
    resolve (source, args) {
        return models.Article.findOneAndDelete(args.id);
    }
}