import mongoose, { Schema } from 'mongoose';

const suggestionSchema = new Schema ({
    text: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        createdAt: Date,
        updatedAt: Date
    }
});

export default mongoose.model('Suggestion', suggestionSchema);
