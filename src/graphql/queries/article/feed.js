import {
    GraphQLList,
    GraphQLID,
    GraphQLInt,
} from 'graphql';

import models from '../../../models/index.js';
import Feed from '../../types/feed.js';

export default {
    type: Feed,
    args: {
        limit: {
            type: GraphQLInt,
            description: 'Limits the number of results returned in the page. Defaults to 3.',
        },
        page: {
            type: GraphQLInt,
        },
    },
    async resolve(root, args) {
        let page = parseInt(args.page);
        let limit = args.limit || 3;
        let offset = limit * (page - 1);

        const feed = await models.Article.find()
            .sort({createdAt: 'desc'})
            .limit(limit)
            .skip(offset)
            .exec();

        const count = await models.Article.countDocuments().exec();

        let pages = Math.ceil(count / limit);
        offset = limit * (page - 1);

        return {
            meta: {
                count,
                page,
                pages
            },
            articles: feed
        };
    }
};