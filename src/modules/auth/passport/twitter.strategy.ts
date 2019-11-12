import { Injectable, Inject } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { use } from 'passport';

import { USER_MODEL_TOKEN, TWITTER_CONFIG_TOKEN, DB_CONNECTION_TOKEN } from '../../../server.constants';
import { IUser } from '../../users/interfaces/user.interface';
import { UserSchema } from '../../users/schemas/user.schema';

import { Request } from 'express';

import { ITwitterConfig } from '../interfaces/twitter-config.interface';

import * as TwitterTokenStrategy from 'passport-twitter-token';
@Injectable()
export class TwitterStrategy {
    private userModel;
    constructor(
        @Inject(TWITTER_CONFIG_TOKEN) private readonly twitterConfig: ITwitterConfig
    ) {
        this.init();
    }

    private init(): void {
        use('twitter', new TwitterTokenStrategy({
            passReqToCallback: true,
            consumerKey: this.twitterConfig.consumer_key,
            consumerSecret: this.twitterConfig.consumer_secret
        }, async (req: Request, accessToken: string, refreshToken: string, profile: any, done: Function) => {
            try {
                const db = req['dbConnection'];
                this.userModel = db.model(USER_MODEL_TOKEN, UserSchema) as Model<IUser>;
                const providerData = profile._json;
                const existingUser: IUser = await this.userModel.findOne({ username: profile.username  });

                if (existingUser) {
                    return done(null, existingUser);
                }

               const providerUserProfile = {
                    firstName: profile.name.givenName || `${profile.id}`,
                    lastName: profile.name.familyName || `${profile.id}`,
                    displayName: profile.displayName ||  null,
                    email: profile.emails[0].value || `${profile.id}@season-employment.com`,
                    username: profile.username || `${profile.id}`,
                    profileImageURL: profile.photos[0].value || null,
                    provider: 'twitter',
                    providerIdentifierField: 'id',
                    providerData
                };

                console.log(providerUserProfile);

                const user: IUser = new this.userModel(providerUserProfile);;

                done(null, await user.save());
            } catch (err) {
                done(err, null);
            }
        }));
    }
}
