import { Schema } from 'mongoose';

/**
 *  Message Schema Declaration for Mongodb, declarated by mongoose schema
 */

export const MessageSchema: Schema = new Schema({
    created: {
        type: Date,
        default: new Date()
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isURL: {
        type: Boolean,
        default: false
    },
    seenBy: [Schema.Types.ObjectId],
    text: {
        type: String,
        default: ''
    },
    recipients: [Schema.Types.ObjectId],
    type: {
        type: String,
        enum: ['text', 'image', 'hyperlink']
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

MessageSchema.pre('save', function(next, params) {
    if (this.isNew) {
        this['wasNew'] = this.isNew;
    }
    next();
});

MessageSchema.post('save', async function(message) {
    if (this.wasNew) {
        console.log('Is Created');
    } else {
        console.log('Is Updated');
    }
});

MessageSchema.methods.patch = async function(object) {
    const message = Object.assign(this, object);
    return await message.save();
};
