import mongoose, { Schema } from 'mongoose';

const articleSchema = new Schema ({
    title: String,
    url: String,
    paragraphs: Array,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.model('Article', articleSchema);
