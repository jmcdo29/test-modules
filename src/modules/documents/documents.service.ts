import { Injectable, Inject, HttpException, HttpStatus, Scope } from '@nestjs/common';
import { Model, Connection } from 'mongoose';

import { DOCUMENT_MODEL_TOKEN } from '../../server.constants';
import { IDocument } from './interfaces/document.interface';
import { DocumentSchema } from './schemas/document.schema';
import { isEmptyObject, returnExtensionByMime, isUserOwner } from '../../common/helpers/utils';

import { parseImageURL } from '../../common/helpers/converters';
import { getErrorMessage } from '../../common/helpers/error-handler';

import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class DocumentsService {
    private documentModel;
    private params;
    private db;
    constructor(@Inject(REQUEST) private readonly request: Request) {
        const db = request['dbConnection'];
        this.documentModel = db.model(DOCUMENT_MODEL_TOKEN, DocumentSchema) as Model<IDocument>;
    }

    async create(document, file) {
        document.extension = returnExtensionByMime(file.mimetype);
        document.url = file.location || file.path.replace('public', '');
        document.contentType = file.contentType || file.mimetype;
        document.isS3 = file.location ? true: false;
        try {
            return await this.documentModel.create(document);
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async list(query?) {
        try {
            return await this.documentModel.find(query);
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async update(document, body) {
        await isUserOwner(this.request.user, document);
        document.name = body.name;
        document.isS3 = body.isS3;
        document.contentType = body.contentType;
        document.extension = body.extension;
        document.url = body.url;
        try {
            return await document.save();
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async patch(document, body) {
        await isUserOwner(this.request.user, document);
        try {
            return await document.patch(body);
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async delete(document) {
        await isUserOwner(this.request.user, document);
        try {
            return await document.remove();
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
}
