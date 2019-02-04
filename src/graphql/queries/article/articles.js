import {
    GraphQLList,
    GraphQLID,
    GraphQLInt,
} from 'graphql';

import models from '../../../models/index.js';
import Article from '../../types/article.js';

export default {
    type: new GraphQLList(Article),
    args: {
        first: {
            type: GraphQLInt,
            description: 'Limits the number of results returned in the page. Defaults to 10.',
        },
        offset: {
            type: GraphQLInt,
        },
    },
    resolve(root, args) {
        let offset = args.offset || 0;
        let limit = args.first || 3;
        delete args.offset;
        delete args.first;

        console.log(5)

        return models.Article.find()
            // .sort({createdAt: 'desc'})
            // .limit(limit)
            // .skip(offset)
            // .exec()
            // .then((articles) => {
            //     models.Article.countDocuments()
            //         .exec()
            //         .then(count => {
            //             let pages = Math.ceil(count / limit);
            //             offset = limit * (page - 1);
            //             return articles
            //         })
            // });
    }
};