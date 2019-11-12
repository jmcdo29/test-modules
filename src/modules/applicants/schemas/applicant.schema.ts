import { Schema } from 'mongoose';

/**
 *  Applicant Schema Declaration for Mongodb, declarated by mongoose schema
 */

export const ApplicantSchema: Schema = new Schema({
    created: {
        type: Date,
        default: new Date()
    },
    name: {
        type: String,
        default: ''
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    applicationDate: {
        type: Date,
        default: new Date()
    },
    sharedDocuments: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Document'
        }]
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

ApplicantSchema.pre('save', function(next, params) {
    if (this.isNew) {
        this['wasNew'] = this.isNew;
    }
    next();
});

ApplicantSchema.post('save', async function(applicant) {
    if (this.wasNew) {
        console.log('Is Created');
    } else {
        console.log('Is Updated');
    }
});

ApplicantSchema.methods.patch = async function(object) {
    const applicant = Object.assign(this, object);
    return await applicant.save();
};
