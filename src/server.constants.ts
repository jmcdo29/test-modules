import { Config, IEnvironmentConfig } from './config/config';
import { EnvironmentService } from './environment.variables';

console.log('Configurating the server');

//  Env service declaration
const envService = new EnvironmentService('.env');

//  Environment variables
const env = envService.get('NODE_ENV') || 'development';

//  SERVER_CONFIG Assignation
export const SERVER_CONFIG: IEnvironmentConfig = Config[env];

//  Token for DB_Connection
export const DB_CONNECTION_TOKEN: string = 'DbConnectionToken';

//  Token for Server
export const SERVER_CONFIG_TOKEN: string = 'ServerConfigToken';

//  Token for twitter_Config
export const FACEBOOK_CONFIG_TOKEN: string = 'FacebookConfigToken';

//  Token for twitter_Config
export const TWITTER_CONFIG_TOKEN: string = 'TwitterConfigToken';

//  Token for Google_config
export const GOOGLE_CONFIG_TOKEN: string = 'GoogleConfigToken';

//  Mailing
export const MAILING_EMAIL: string = envService.get('MAILING_EMAIL') || 'put-a-default-email-here@example.com';

export const MAILING_PASSWORD: string = envService.get('MAILING_PASSWORD') || 'your-default-mailing-password-here';

export const DB_PREFIX: string = envService.get('DB_PREFIX') || 'duopoly';

export const DATABASES: string[] = envService.get('DBS').split(',');

/**
 *  Token for Models
 */
export const USER_MODEL_TOKEN: string = 'User';
export const ARTICLE_MODEL_TOKEN: string = 'Article';
export const PLAN_MODEL_TOKEN: string = 'Plan';
export const SUBSCRIPTION_MODEL_TOKEN: string = 'Subscription';
export const CATEGORY_MODEL_TOKEN: string = 'Category';
export const DOCUMENT_MODEL_TOKEN: string = 'Document';
export const JOB_MODEL_TOKEN: string = 'Job';
export const COMPANY_MODEL_TOKEN: string = 'Company';
export const MESSAGE_MODEL_TOKEN: string = 'Message';
export const APPLICANT_MODEL_TOKEN: string = 'Applicant';

export const TRIAL_DAYS: number = parseInt(envService.get('TRIAL_DAYS'), 10) || 15;

//  Message definitions
export const MESSAGES = {
	FORBIDDEN_OPERATION: 'Error, You cannot delete it',
	EMAIL_REQUIRED: 'Email is required',
	INVALID_VERIFICATION_TOKEN: 'Invalid verification token',
	PASSWORD_RESET_TOKEN_INVALID_OR_EXPIRED: 'Password reset token is invalid or has expired.',
	PASSWORD_NOT_MATCH: 'Passwords do not match',
	EMAIL_SENT: 'Message sent, verify your email address',
	INVALID_RESET_TOKEN: 'Invalid Reset Token',
    UNAUTHORIZED_EMAIL_OR_USERNAME_IN_USE: 'Email or username already exists',
    UNAUTHORIZED_INVALID_PASSWORD: 'Invalid password',
    UNAUTHORIZED_INVALID_EMAIL: 'The email does not exist',
    UNAUTHORIZED_UNRECOGNIZED_BEARER: 'Unrecognized bearer of the token'
};
