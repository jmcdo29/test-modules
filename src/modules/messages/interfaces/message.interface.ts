import { Document } from 'mongoose';

/**
 *  Declaring the Interface Message
 */
export interface IMessage extends Document {
    created: Date;
    sender: string;
    isURL: boolean;
    seenBy: string[];
    text: string;
    recipients: string[];
    type: string; //  Text, Image, Hyperlink
}
