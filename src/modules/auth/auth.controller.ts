import { Controller, Post, Get, Req, Res, Next, UseGuards, UnprocessableEntityException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { IToken } from './interfaces/token.interface';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('local/signup')
    async requestJsonWebTokenAfterLocalSignUp(@Req() req: Request): Promise<IToken> {
        return await this.authService.createUserAndReturnToken(req.body);
    }

    @Post('local/signin')
    async requestJsonWebTokenAfterLocalSignIn(@Req() req: Request): Promise<IToken> {
        return await this.authService.createToken(req.user);
    }

    @Get('facebook/uri')
    async requestFacebookRedirectUrl(): Promise<{ redirect_uri: string }> {
        return await this.authService.requestFacebookRedirectUri();
    }

    @Post('facebook/signin')
    async facebookSignIn(@Req() req: Request, @Res() res: Response, @Next() next): Promise<IToken> {
        if (req.body.code) {
            return await this.authService.facebookSignIn(req.body.code);            
        } else {
            return next(new UnprocessableEntityException('Validation error, Code is required'));
        }
    }

    @Post('facebook/token')
    async requestJsonWebTokenAfterFacebookSignIn(@Req() req: Request): Promise<IToken> {
        return await this.authService.createToken(req.user);
    }

    @Get('twitter/uri')
    async requestTwitterRedirectUri(): Promise<any> {
        return await this.authService.requestTwitterRedirectUri();
    }

    @Post('twitter/signin')
    async twitterSignIn(@Req() req: Request): Promise<any> {
        return await this.authService.twitterSignIn(req.body.oauth_token, req.body.oauth_verifier);
    }

    @Post('twitter/token')
    async requestJsonWebTokenAfterTwitterSignIn(@Req() req: Request): Promise<IToken> {
        return await this.authService.createToken(req.user);
    }

    @Get('google/uri')
    async requestGoogleRedirectUri(): Promise<any> {
        return await this.authService.requestGoogleRedirectUri();
    }

    @Post('google/signin')
    async googleSignIn(@Req() req: Request): Promise<any> {
        return await this.authService.googleSignIn(req.body.code);
    }

    @Post('google/token')
    async requestJsonWebTokenAfterGoogleSignIn(@Req() req: Request): Promise<IToken> {
        return await this.authService.createToken(req.user);
    }

    @Post('forgot')
    async forgotPassword(@Req() req: Request) {
        return await this.authService.sendForgotPasswordEmail(req.body.email);
    }

    @Get('reset/:token')
    async validateResetToken(@Req() req: Request) {
        return await this.authService.validateResetToken(req.params.token);
    }

    @Post('reset/:token')
    async resetPassword(@Req() req: Request) {
        return await this.authService.resetPassword(req.body, req.params.token);
    }

    @Post('verification/resend')
    async resendVerificationEmail(@Req () req: Request) {
        return await this.authService.sendVerificationEmail(req.body.email);
    }

    @Get('verify/:token')
    async verifyAccount(@Req() req: Request) {
        return await this.authService.verifyAccount(req.params.token);
    }
}
