import {
    GraphQLInputObjectType,
    GraphQLString
} from 'graphql';

export default new GraphQLInputObjectType({
    name: 'articleinput',
    fields: () => ({
        title: { type: GraphQLString },
        url: { type: GraphQLString },
        paragraphs: { type: GraphQLString }
    })
});