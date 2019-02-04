import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList, GraphQLBoolean
} from 'graphql';


export default new GraphQLObjectType({
    name: 'user',
    description: 'any user',
    fields() {
        return {
            id: {
                type: GraphQLID,
                description: 'user id',
                resolve (user) {
                    return user.id
                }
            },
            username: {
                type: GraphQLString,
                description: 'user username',
                resolve (user) {
                    return user.username
                }
            },
            email: {
                type: GraphQLString,
                description: 'user email',
                resolve (user) {
                    return user.email
                }
            },
            salt: {
                type: GraphQLString,
                description: 'user salt',
                resolve (user) {
                    return user.salt
                }
            },
            password: {
                type: GraphQLString,
                description: 'user password',
                resolve (user) {
                    return user.password
                }
            },
            isAdmin: {
                type: GraphQLBoolean,
                description: 'user role',
                resolve (user) {
                    return user.isAdmin
                }
            }
        }
    }

})