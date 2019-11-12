import { Schema } from 'mongoose';
import { IPlan } from '../interfaces/plan.interface';
/**
 *  Plan Schema Declaration for Mongodb, declarated by mongoose schema
 */

export const PlanSchema: Schema = new Schema({
    created: {
        type: Date,
        default: new Date()
    },
    name: {
        type: String,
        required: true
    },
    measure: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    valueInDays: {
        type: Number,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

PlanSchema.pre<IPlan>('save', function(next) {
    if (this.isNew) {
        this['wasNew'] = this.isNew;
        switch (this.measure) {
            case 'daily':
                this.valueInDays = <any>this.quantity * 1;
            break;
            case 'weekly':
                this.valueInDays = <any>this.quantity * 7;
            break;
            case 'monthly':
                this.valueInDays = <any>this.quantity * 30;
            break;

            case 'yearly':
                this.valueInDays = <any>this.quantity * 365;
            break;
        }
    }
    next();
});

PlanSchema.post('save', async function(plan) {
    if (this.wasNew) {
        console.log('Plan Is Created');
    } else {
        console.log('Plan Is Updated');
    }
});

PlanSchema.methods.patch = async function(object) {
    const plan = Object.assign(this, object);
    return await plan.save();
};
