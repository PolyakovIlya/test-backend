import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList
} from 'graphql';

import Article from './article'
import Pagination from './pagination'
import models from '../../models';


export default new GraphQLObjectType({
    name: 'feed',
    description: 'all articles',
    fields() {
        return {
            meta: {
                type: Pagination,
                description: 'articles meta',
                resolve (feed) {
                    return feed.meta
                }
            },
            articles: {
                type: new GraphQLList(Article),
                description: 'articles',
                resolve (feed) {
                    return feed.articles
                }
            },

        }
    }

})