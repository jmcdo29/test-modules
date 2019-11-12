import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';

@Injectable()
/**
 *  Function for local Observable Variables
 */
export class GlobalVariables {
    constructor() {
        console.log('Global Variable Handler');
    }
    private socketConnection = new BehaviorSubject<object>(null);

    currentSocketConnection = this.socketConnection.asObservable();

    changeSocketStatus(connection) {
        this.socketConnection.next(connection);
    }
}
