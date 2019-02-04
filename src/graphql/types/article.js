import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList
} from 'graphql';

import Suggestion from './suggestion'
import models from '../../models';


export default new GraphQLObjectType({
    name: 'article',
    description: 'any article',
    fields() {
        return {
            id: {
                type: GraphQLID,
                description: 'article id',
                resolve (article) {
                    return article.id
                }
            },
            title: {
                type: GraphQLString,
                description: 'article title',
                resolve (article) {
                    return article.title
                }
            },
            url: {
                type: GraphQLString,
                description: 'article url',
                resolve (article) {
                    return article.url
                }
            },
            paragraphs: {
                type: GraphQLString,
                description: 'article paragraphs',
                resolve (article) {
                    return article.paragraphs
                }
            },
            suggestions: {
                type: GraphQLList(Suggestion),
                description: 'article suggestions',
                resolve (article) {
                    return models.Suggestion.find({ id: article.id });
                }
            }

        }
    }

})