import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLList
} from 'graphql';

import Article from './article';
import models from '../../models';

export default new GraphQLObjectType({
    name: 'suggestion',
    description: 'any suggestion',
    fields() {
        return {
            id: {
                type: GraphQLID,
                description: 'suggestion id',
                resolve (suggestion) {
                    return suggestion.id
                }
            },
            text: {
                type: GraphQLString,
                description: 'suggestion text',
                resolve (suggestion) {
                    return suggestion.text
                }
            },
            status: {
                type: GraphQLString,
                description: 'suggestion status',
                resolve (suggestion) {
                    return suggestion.status
                }
            },
            article: {
                type: Article,
                description: 'suggestion article',
                resolve (suggestion) {
                    return models.Article.findById(suggestion.articleId)
                }
            },
            paragraph_id: {
                type: GraphQLInt,
                description: 'suggestion paragraph id',
                resolve (suggestion) {

                }
            }
        }
    }

})