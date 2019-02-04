import {
    GraphQLInputObjectType, GraphQLInt,
    GraphQLString
} from 'graphql';

export default new GraphQLInputObjectType({
    name: 'suggestioninput',
    fields: () => ({
        text: { type: GraphQLString },
        status: { type: GraphQLString },
        articleId: { type: GraphQLInt },
        paragraph_id: { type: GraphQLInt }
    })
});