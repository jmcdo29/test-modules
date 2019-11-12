import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class DoStuffMiddleware implements NestMiddleware {
    use(req, res, next: Function) {
    	console.log('DO STUFF MIDDLEWARE-----------------------');
    	next();
    }
}
