import { Injectable, Inject, HttpException, HttpStatus, Scope } from '@nestjs/common';
import { Model, Connection } from 'mongoose';

import { COMPANY_MODEL_TOKEN } from '../../server.constants';
import { ICompany } from './interfaces/company.interface';
import { CompanySchema } from './schemas/company.schema';
import { isEmptyObject } from '../../common/helpers/utils';

import { parseImageURL } from '../../common/helpers/converters';
import { getErrorMessage } from '../../common/helpers/error-handler';

import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class CompaniesService {
    private companyModel;
    private params;
    constructor(@Inject(REQUEST) private readonly request: Request) {
        const db = request['dbConnection'];
        this.companyModel = db.model(COMPANY_MODEL_TOKEN, CompanySchema) as Model<ICompany>;
    }

    async create(company) {        
        try {
            return await this.companyModel.create(company);
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async list() {
        try {
            return await this.companyModel.find();
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async update(company, body) {
        company.name = body.name;
        company.description = body.description;
        company.address = body.address;
        try {
            return await company.save();
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async patch(company, body) {
        try {
            return await company.patch(body);
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async delete(company) {
        try {
            return await company.remove();
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async validateEmployerUser(user) {
        if (user.userType !== 'employer') {
            throw new HttpException('Error, operation not allowed', HttpStatus.FORBIDDEN);
        }
    }
}
