import { Injectable, Inject, HttpException, HttpStatus, Scope } from '@nestjs/common';
import { Model, Connection } from 'mongoose';

import { JOB_MODEL_TOKEN } from '../../server.constants';
import { IJob } from './interfaces/job.interface';
import { JobSchema } from './schemas/job.schema';
import { isEmptyObject } from '../../common/helpers/utils';

import { parseImageURL } from '../../common/helpers/converters';
import { getErrorMessage } from '../../common/helpers/error-handler';

import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class JobsService {
    private jobModel;
    private params;
    private db;
    constructor(@Inject(REQUEST) private readonly request: Request) {
        const db = request['dbConnection'];
        this.jobModel = db.model(JOB_MODEL_TOKEN, JobSchema) as Model<IJob>;
    }

    async create(job) {
        try {
            return await this.jobModel.create(job);
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async list() {
        try {
            return await this.jobModel.find();
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async update(job, body) {
        job.name = body.name;
        job.description = body.description;
        job.isScheduled = body.isScheduled;
        job.startDate = body.startDate;
        job.endDate = body.endDate;
        job.paymentInterval = body.paymentInterval;
        job.isACtive = body.isActive;
        job.activityId = body.activityId;
        try {
            return await job.save();
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async patch(job, body) {
        try {
            return await job.patch(body);
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async delete(job) {
        try {
            return await job.remove();
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
}
