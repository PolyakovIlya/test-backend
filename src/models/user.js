import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

const userSchema = new Schema ({
    username: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => (
            validator.isEmail(value)
        ),
        createdAt: Date,
        updatedAt: Date
    },
    password: String,
    salt: String,
    isAdmin: Boolean
});

export default mongoose.model('User', userSchema);