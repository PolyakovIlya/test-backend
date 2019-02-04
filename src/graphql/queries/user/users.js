import {
    GraphQLInt, GraphQLList, GraphQLString
} from 'graphql';

import models from '../../../models/index.js';
import User from '../../types/user.js';

export default {
    type: new GraphQLList(User),
    resolve(root, args) {
        return models.User.find()
    }
}