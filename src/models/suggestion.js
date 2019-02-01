import mongoose, { Schema } from 'mongoose';

const suggestionSchema = new Schema ({
    text: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    articleId: {
        type: String
    },
    paragraph_id: {
        type: Number
    }
});

suggestionSchema.set('toJSON', {
    virtuals: true
});

export default mongoose.model('Suggestion', suggestionSchema);
