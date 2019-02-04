import {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLBoolean
} from 'graphql';

export default new GraphQLInputObjectType({
    name: 'userRegisterInput',
    fields: () => ({
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        salt: { type: GraphQLString },
        password: { type: GraphQLString },
        isAdmin: { type: GraphQLBoolean }
    })
});