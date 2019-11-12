import { Injectable, Inject, HttpException, HttpStatus, Scope } from '@nestjs/common';
import { Model, Connection } from 'mongoose';

import { SUBSCRIPTION_MODEL_TOKEN } from '../../server.constants';
import { ISubscription } from './interfaces/subscription.interface';
import { SubscriptionSchema } from './schemas/subscription.schema';
import { isEmptyObject } from '../../common/helpers/utils';

import { parseImageURL } from '../../common/helpers/converters';
import { getErrorMessage } from '../../common/helpers/error-handler';

import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { PlansService } from '../plans/plans.service';

import * as moment from 'moment';

@Injectable()
export class SubscriptionsService {
    private subscriptionModel;
    private params;
    private db;
    constructor(@Inject(REQUEST) private readonly request: Request,
                private readonly planService: PlansService) {
        const db = request['dbConnection'];
        this.subscriptionModel = db.model(SUBSCRIPTION_MODEL_TOKEN, SubscriptionSchema) as Model<ISubscription>;
    }

    async createSubscription(userId, type) {
        //  Types = free, trial
        const plan = await this.planService.findOne({ name: type });
        let subscription = {
            planId: plan._id,
            userId,
            startDate: moment(),
            endDate: moment().add(plan.valueInDays, 'days')
        };

        try {
            return await this.subscriptionModel.create(subscription);
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }


    async create(subscription) {
        try {
            return await this.subscriptionModel.create(subscription);
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async list() {
        try {
            return await this.subscriptionModel.find();
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async update(subscription, body) {
        subscription.subscriptionName = body.subscriptionName;
        try {
            return await subscription.save();
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async patch(subscription, body) {
        try {
            return await subscription.patch(body);
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async delete(subscription) {
        try {
            return await subscription.remove();
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
}
