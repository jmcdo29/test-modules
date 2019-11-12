import { Schema } from 'mongoose';

/**
 *  Category Schema Declaration for Mongodb, declarated by mongoose schema
 */

export const CategorySchema: Schema = new Schema({
    created: {
        type: Date,
        default: new Date()
    },
    name: {
        type: String,
        required: 'Category name is required'
    },
    description: {
        type: String,
        default: 'Category descriptoin is required'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

CategorySchema.pre('save', function(next, params) {
    if (this.isNew) {
        this['wasNew'] = this.isNew;
    }
    next();
});

CategorySchema.post('save', async function(category) {
    if (this.wasNew) {
        console.log('Is Created');
    } else {
        console.log('Is Updated');
    }
});

CategorySchema.methods.patch = async function(object) {
    const category = Object.assign(this, object);
    return await category.save();
};
