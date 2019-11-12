import { Schema } from 'mongoose';

/**
 *  Subscription Schema Declaration for Mongodb, declarated by mongoose schema
 */

export const SubscriptionSchema: Schema = new Schema({
    created: {
        type: Date,
        default: new Date()
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        //  required: 'Provide the user id for the suscription'
    },
    planId: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
        default: null,
        //  required: 'Provide the plan id for the subscription'
    },
    startDate: {
        type: Date,
        required: 'Start date is required'
    },
    endDate: {
        type: Date,
        required: 'End date is required'
    },
    active: {
        type: Boolean,
        default: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

SubscriptionSchema.pre('save', function(next, params) {
    if (this.isNew) {
        this['wasNew'] = this.isNew;
    }
    next();
});

SubscriptionSchema.post('save', async function(subscription) {
    if (this.wasNew) {
        console.log('Is Created');
    } else {
        console.log('Is Updated');
    }
});

SubscriptionSchema.methods.patch = async function(object) {
    const subscription = Object.assign(this, object);
    return await subscription.save();
};
