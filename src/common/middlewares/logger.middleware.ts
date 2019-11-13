import { Injectable, NestMiddleware } from '@nestjs/common';
import { white, blue } from 'chalk';
import { getMethodColor } from '../helpers/utils';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req, res, next: Function) {
    	console.log(blue('-----------LOGGER MIDDLEWARE IS FIRED------------'));
        let logMessage;
        const methodColor = getMethodColor(req.method);
        logMessage = `[URL]: ${req.baseUrl}`;
        const db = req['dbConnection'];
        console.log(`[${methodColor(req.method)}]-${white(req.baseUrl)} - Database: ${db.name}`);
        next();
    }
}
