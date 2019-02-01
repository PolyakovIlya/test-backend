import mongoose, { Schema } from 'mongoose';

const articleSchema = new Schema ({
    title: String,
    url: String,
    paragraphs: Array,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

articleSchema.set('toJSON', {
    virtuals: true
});

export default mongoose.model('Article', articleSchema);
