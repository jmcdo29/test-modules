import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response } from 'express';

import { Connection, Model } from 'mongoose';
import { getDatabaseFromOrigin } from '../helpers/utils';
import { verify } from 'jsonwebtoken';

import { USER_MODEL_TOKEN, SERVER_CONFIG, DB_CONNECTION_TOKEN } from '../../server.constants';
import { IUser } from '../../modules/users/interfaces/user.interface';
import { UserSchema } from '../../modules/users/schemas/user.schema';

import { white, blue, green } from 'chalk';
import { getMethodColor } from '../helpers/utils';
@Injectable()
export class TenantHelper  {
    constructor(connection, req, res) {
        console.log('Initializing tenant helper');
        req['tenantHelperCalled'] = true;
        this.initializeHelper(connection, req, res);
    }

    async initializeHelper(connection, req, res) {
        await this.setDatabase(connection, req);
        await this.setReqUser(connection, req, res);
        await this.showLog(req, res);
    }

    setDatabase(connection, req) {
        return new Promise((resolve, reject) => {
            const database = getDatabaseFromOrigin(req.headers);
            req['dbConnection'] = connection[database]; 
            resolve();
        });
    }

    setReqUser(connection, req, res) {
        const db = req['dbConnection'];
        return new Promise(async resolve => {
            const User = db.model(USER_MODEL_TOKEN, UserSchema) as Model<IUser>;
            let parsedToken = {};
            const token: any = req.headers.authorization || req.headers.Authorization;
            if (token) {
                try {
                    parsedToken = verify(token, SERVER_CONFIG.jwtSecret);
                    req.user = await User.findById(parsedToken['_id'])
                        .select('-salt -password -resetPasswordToken -resetPasswordExpired -verificationToken -resetPasswordExpires');
                } catch (ex) {
                    return res.status(500).send(ex);
                }
            }
            console.log(req.user);
            console.log(token);
            resolve();         
        });
    }

    showLog(req, res) {
        console.log(blue('-----------------------'));
        let logMessage;
        const methodColor = getMethodColor(req.method);
        logMessage = `[URL]: ${req.baseUrl}`;
        const db = req['dbConnection'];
        console.log(`[${methodColor(req.method)}]-${white(req.baseUrl)} - Database: ${db.name}`);
    }
}
