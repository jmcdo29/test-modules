import { Schema } from 'mongoose';

/**
 *  Company Schema Declaration for Mongodb, declarated by mongoose schema
 */

export const CompanySchema: Schema = new Schema({
    created: {
        type: Date,
        default: new Date()
    },
    name: {
        type: String,
        required: 'Company name field is required'
    },
    description: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        required: 'Address is required'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

CompanySchema.pre('save', function(next, params) {
    if (this.isNew) {
        this['wasNew'] = this.isNew;
    }
    next();
});

CompanySchema.post('save', async function(company) {
    if (this.wasNew) {
        console.log('Is Created');
    } else {
        console.log('Is Updated');
    }
});

CompanySchema.methods.patch = async function(object) {
    const company = Object.assign(this, object);
    return await company.save();
};
