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
        )
    },
    password: String,
    salt: String,
    isAdmin: Boolean,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('User', userSchema);