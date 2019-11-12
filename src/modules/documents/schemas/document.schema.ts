import { Schema } from 'mongoose';

/**
 *  Document Schema Declaration for Mongodb, declarated by mongoose schema
 */

export const DocumentSchema: Schema = new Schema({
    created: {
        type: Date,
        default: new Date()
    },
    name: {
        type: String,
        required: 'Document name is required'
    },
    contentType: {
        type: String,
        required: 'content type is required'
    },
    extension: {
        type: String,
        required: 'Extension is required'
    },
    isS3: {
        type: Boolean
    },
    url: {
        type: String,
        required: 'Url is required'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

DocumentSchema.pre('save', function(next, params) {
    if (this.isNew) {
        this['wasNew'] = this.isNew;
    }
    next();
});

DocumentSchema.post('save', async function(document) {
    if (this.wasNew) {
        console.log('Is Created');
    } else {
        console.log('Is Updated');
    }
});

DocumentSchema.methods.patch = async function(object) {
    const document = Object.assign(this, object);
    return await document.save();
};
