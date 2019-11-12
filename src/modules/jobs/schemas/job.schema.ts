import { Schema } from 'mongoose';

/**
 *  Job Schema Declaration for Mongodb, declarated by mongoose schema
 */

export const JobSchema: Schema = new Schema({
    created: {
        type: Date,
        default: new Date()
    },
    name: {
        type: String,
        required: 'Job Name is required'
    },
    description: {
        type: String,
        required: 'Job Description is a required field'
    },
    isScheduled:  {
        type: Boolean,
        required: 'is this scheduled?'
    },
    startDate: {
        type: Date,
        required: 'Please provide the start date for this job publication'
    },
    endDate: {
        type: Date,
        required: 'Please provide the end date for this job publication'
    },
    paymentInterval: {
        type: String,
        required: 'Payment interval is required, you can choose hourly, weekly, monthly, etc'
    },
    isActive: {
        type: Boolean,
        required: 'Please let us know if this job is actived from now'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

JobSchema.pre('save', function(next, params) {
    if (this.isNew) {
        this['wasNew'] = this.isNew;
    }
    next();
});

JobSchema.post('save', async function(job) {
    if (this.wasNew) {
        console.log('Is Created');
    } else {
        console.log('Is Updated');
    }
});

JobSchema.methods.patch = async function(object) {
    const job = Object.assign(this, object);
    return await job.save();
};
