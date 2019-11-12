import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { sign } from 'jsonwebtoken';
import { get, post, Response } from 'request';

import { getErrorMessage } from '../../common/helpers/error-handler';

import {
    SERVER_CONFIG,
    USER_MODEL_TOKEN,
    FACEBOOK_CONFIG_TOKEN,
    TWITTER_CONFIG_TOKEN,
    GOOGLE_CONFIG_TOKEN,
    MESSAGES
} from '../../server.constants';
import { IUser } from '../users/interfaces/user.interface';
import { IToken } from './interfaces/token.interface';
import { IFacebookConfig } from './interfaces/facebook-config.interface';
import { ITwitterConfig } from './interfaces/twitter-config.interface';
import { IGoogleConfig } from './interfaces/google-config.interface';

import { generateRandomToken } from '../../utilities/encryption';
import { sendEmail, templateList } from '../../utilities/mailing/mailing';

import { UserSchema } from '../users/schemas/user.schema';

import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
@Injectable()
export class AuthService {
    private userModel;
    private url: string;
    private params;
    constructor(
        @Inject(FACEBOOK_CONFIG_TOKEN) private readonly fbConfig: IFacebookConfig,
        @Inject(TWITTER_CONFIG_TOKEN) private readonly twitterConfig: ITwitterConfig,
        @Inject(GOOGLE_CONFIG_TOKEN) private readonly googleConfig: IGoogleConfig,
        @Inject(REQUEST) private readonly request: Request,
        private readonly subscriptionService: SubscriptionsService
    ) {
        const db = request['dbConnection'];
        this.userModel = db.model(USER_MODEL_TOKEN, UserSchema) as Model<IUser>;
        this.url = `${SERVER_CONFIG.httpProtocol}://${SERVER_CONFIG.domain}:${SERVER_CONFIG.httpPort}`;
    }

    async createUserAndReturnToken(user: IUser): Promise<IToken> {
        const expiresIn = '48h';
        const newUser: IUser = new this.userModel({
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            username: user.username,
            password: user.password,
            provider: 'local',
            providerData: null,
            userType: user.userType,
            additionalProvidersData: null,
            roles: user.roles || 'user'
        });

        try {
            await newUser.save();
            switch (user.userType) {
                case 'employee':
                    await this.subscriptionService.createSubscription(newUser._id, 'free');
                break;
                case 'employer':
                    await this.subscriptionService.createSubscription(newUser._id, 'trial');
                break;
            }

            const token = sign({
                _id: newUser._id
            }, SERVER_CONFIG.jwtSecret, {
                    expiresIn
                });

            return {
                token
            };
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async createToken(user): Promise<IToken> {
        const expiresIn: string = '48h';
        const token: string = sign({
            _id: user.id
        }, SERVER_CONFIG.jwtSecret, { expiresIn });

        return {
            token
        };
    }

    async findUserById(id: string): Promise<IUser> {
        return await this.userModel.findById(id);
    }

    async requestFacebookRedirectUri(): Promise<{ redirect_uri: string }> {
        const queryParams: string[] = [
            `client_id=${this.fbConfig.client_id}`,
            `redirect_uri=${this.fbConfig.oauth_redirect_uri}`,
            `state=${this.fbConfig.state}`
        ];
        const redirect_uri: string = `${this.fbConfig.login_dialog_uri}?${queryParams.join('&')}`;

        return {
            redirect_uri
        };
    }

    async facebookSignIn(code: string): Promise<any> {
        console.log('Llego aqui');
        const queryParams: string[] = [
            `client_id=${this.fbConfig.client_id}`,
            `redirect_uri=${this.fbConfig.oauth_redirect_uri}`,
            `client_secret=${this.fbConfig.client_secret}`,
            `code=${code}`
        ];

        const uri: string = `${this.fbConfig.access_token_uri}?${queryParams.join('&')}`;

        return new Promise((resolve: Function, reject: Function) => {
            get(uri, (error: Error, response: Response, body: any) => {
                if (error) {
                    return reject(error);
                }

                if (body.error) {
                    return reject(body.error);
                }

                const { access_token } = JSON.parse(body);

                post({
                    url: `${this.url}/api/auth/facebook/token`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        access_token
                    }
                }, async (err: Error, res: Response, result: any) => {
                    if (err) {
                        return reject(err);
                    }

                    if (result.error) {
                        return reject(result.error);
                    }
                    resolve(result);
                });
            });
        });
    }

    async requestTwitterRedirectUri(): Promise<{ redirect_uri: string } | any> {
        return new Promise((resolve: Function, reject: Function) => {
            post({
                url: this.twitterConfig.request_token_uri,
                oauth: {
                    consumer_key: this.twitterConfig.consumer_key,
                    consumer_secret: this.twitterConfig.consumer_secret,
                    callback: this.twitterConfig.oauth_redirect_uri
                },
            }, async (err: Error, res: Response, body: any) => {
                if (err) {
                    return reject(err);
                }

                if (body.error) {
                    return reject(body.error);
                }

                const { oauth_token } = this.parseTwitterResponse(body);
                const redirect_uri: string = `${this.twitterConfig.login_dialog_uri}?oauth_token=${oauth_token}`;

                resolve({
                    redirect_uri
                });
            });
        });
    }

    async twitterSignIn(oauth_token: string, oauth_verifier: string): Promise<any> {
        return new Promise((resolve: Function, reject: Function) => {
            post({
                url: this.twitterConfig.access_token_uri,
                oauth: {
                    consumer_key: this.twitterConfig.consumer_key,
                    consumer_secret: this.twitterConfig.consumer_secret,
                    token: oauth_token,
                    verifier: oauth_verifier
                }
            }, async (err: Error, res: Response, body: any) => {
                if (err) {
                    return reject(err);
                }

                if (body.error) {
                    return reject(body.error);
                }

                const { oauth_token, oauth_token_secret, user_id } = this.parseTwitterResponse(body);

                post({
                    url: `${this.url}/api/auth/twitter/token`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        oauth_token,
                        oauth_token_secret,
                        user_id
                    }
                }, async (err: Error, res: Response, body: any) => {
                    if (err) {
                        return reject(err);
                    }

                    if (body.error) {
                        return reject(body.error);
                    }

                    resolve(body);
                });
            });
        });
    }

    async requestGoogleRedirectUri(): Promise<{ redirect_uri: string } | any> {
        const queryParams: string[] = [
            `client_id=${this.googleConfig.client_id}`,
            `redirect_uri=${this.googleConfig.oauth_redirect_uri}`,
            `response_type=${this.googleConfig.response_type}`,
            `scope=${this.googleConfig.scopes.join(' ')}`
        ];
        const redirect_uri: string = `${this.googleConfig.login_dialog_uri}?${queryParams.join('&')}`;

        return {
            redirect_uri
        };
    }

    async googleSignIn(code: string): Promise<any> {
        return new Promise((resolve: Function, reject: Function) => {
            post({
                url: this.googleConfig.access_token_uri,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: {
                    code,
                    client_id: this.googleConfig.client_id,
                    client_secret: this.googleConfig.client_secret,
                    redirect_uri: this.googleConfig.oauth_redirect_uri,
                    grant_type: this.googleConfig.grant_type
                }
            }, async (err: Error, res: Response, body: any) => {
                if (err) {
                    return reject(err);
                }

                if (body.error) {
                    return reject(body.error);
                }

                const { access_token } = JSON.parse(body);

                post({
                    url: `${this.url}/api/auth/google/token`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        access_token
                    }
                }, async (err: Error, res: Response, body: any) => {
                    if (err) {
                        return reject(err);
                    }

                    if (body.error) {
                        return reject(body.error);
                    }

                    resolve(body);
                });
            });
        });
    }

    private parseTwitterResponse(response: string): { [key: string]: string | boolean } {
        const regex: RegExp = /([a-z_]+?)=([a-zA-Z0-9_-]+)/g;
        const parsedResponse: { [key: string]: string } = {};

        let match: RegExpMatchArray = regex.exec(response);

        while (match) {
            match.shift();

            parsedResponse[match.shift()] = match.shift();

            match = regex.exec(response);
        }

        return parsedResponse;
    }

    async sendVerificationEmail(email: string) {
        if (!email) {
            throw new HttpException(MESSAGES.EMAIL_REQUIRED, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        try {
            const user = await this.userModel.findOne({ email }, '-salt -password');
            if (!user || !user.verificationToken || user.isVerified) {
                throw new HttpException(MESSAGES.INVALID_VERIFICATION_TOKEN, HttpStatus.UNPROCESSABLE_ENTITY);
            } else {

                // 3.-  We will create an url like this http://domain.com/reset/token
                const verificationLink = `http://domain.com/auth/activate/${user.verificationToken}`;

                let replacements = {
                  '{{verificationLink}}': verificationLink
                };

                const options = {
                    to: user.email,
                    multipleRecipients: false, 
                    subject: 'Account verification',
                    templateName: templateList.accountVerification,
                    replacements
                };

                await sendEmail(options);
                return {
                    message: MESSAGES.EMAIL_SENT
                }
            }            
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async sendForgotPasswordEmail(email: string) {
        if (!email) {
            throw new HttpException(MESSAGES.EMAIL_REQUIRED, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        // 1.-  We will search if exist any user with the provided email
        try {
            const user = await this.userModel.findOne({ email }, '-salt -password');
            if (!user) {
                throw new HttpException('User Not Found', HttpStatus.UNPROCESSABLE_ENTITY);
            } else {
                // 2.-  If the user exists, we will create a reset password token, expiration, and update the user
                const token = generateRandomToken();
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;
                await user.save();

                // 3.-  We will create an url like this http://domain.com/reset/token
                const frontEndUrl = `http://domain.com/auth/reset/${token}`;

                let replacements = {
                  '{{replacement1}}': frontEndUrl,
                  '{{replacement2}}': 'REPLACEMENT 2',
                  '{{replacement3}}': 'REPLACEMENT 3',
                  '{{replacement4}}': 'REPLACEMENT 4',
                  '{{replacement5}}': 'REPLACEMENT 5'
                };

                const options = {
                    to: user.email,
                    multipleRecipients: false, 
                    subject: 'Password reset',
                    templateName: templateList.passwordReset,
                    replacements
                };

                await sendEmail(options);
                return {
                    message: MESSAGES.EMAIL_SENT
                }
            }
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
       
        
        // 4.-  We will send a message to the user email, so the user can access directly to the link and change the password
    }

    async validateResetToken(resetPasswordToken: string) {
        try {
            const user = await this.userModel.findOne({ resetPasswordToken, resetPasswordExpires: { $gt: Date.now() }});
            if (!user) {
                throw new HttpException(MESSAGES.INVALID_RESET_TOKEN, HttpStatus.UNPROCESSABLE_ENTITY);
            } else {
                return {
                    isValid: true
                }
            }
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }


    async resetPassword(passwordDetails, resetPasswordToken) {
        try {
            if (passwordDetails.newPassword !== passwordDetails.verifyPassword) {
                throw new HttpException(MESSAGES.PASSWORD_NOT_MATCH, HttpStatus.UNPROCESSABLE_ENTITY);
            }

            const user = await this.userModel.findOne({ resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } });
            if (!user) {
                throw new HttpException(MESSAGES.PASSWORD_RESET_TOKEN_INVALID_OR_EXPIRED, HttpStatus.UNPROCESSABLE_ENTITY);
            } else {
                user.password = passwordDetails.newPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                await user.save();
                return await this.createToken(user);
            }

        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async verifyAccount(verificationToken) {
        try {
            const user = await this.userModel.findOne({ verificationToken });
            if (!user) {
                throw new HttpException(MESSAGES.INVALID_VERIFICATION_TOKEN, HttpStatus.UNPROCESSABLE_ENTITY);
            } else {
                user.isVerified = true;
                user.verificationToken = undefined;
                await user.save();
                return await this.createToken(user);
            }
        } catch (ex) {
            throw new HttpException(getErrorMessage(ex), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
}
