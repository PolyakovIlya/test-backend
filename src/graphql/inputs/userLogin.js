import {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLBoolean
} from 'graphql';

export default new GraphQLInputObjectType({
    name: 'userLoginInput',
    fields: () => ({
        username: { type: GraphQLString },
        password: { type: GraphQLString }
    })
});