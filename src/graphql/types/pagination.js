import {
    GraphQLObjectType,
    GraphQLInt
} from 'graphql';

export default new GraphQLObjectType({
    name: 'pagination',
    description: 'pagination',
    fields() {
        return {
            count: {
                type: GraphQLInt,
                description: 'pagination count',
                resolve (pagination) {
                    return pagination.count
                }
            },
            page: {
                type: GraphQLInt,
                description: 'pagination page',
                resolve (pagination) {
                    return pagination.page
                }
            },
            pages: {
                type: GraphQLInt,
                description: 'pagination pages',
                resolve (pagination) {
                    return pagination.pages
                }
            }
        }
    }

})