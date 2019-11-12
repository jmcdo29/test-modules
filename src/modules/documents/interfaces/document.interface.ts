import { Document } from 'mongoose';

/**
 *  Declaring the Interface Document
 */
export interface IDocument extends Document {
    created: Date;
    name: string;
    type: string; // Can be, image, document, file
    extension: string; // Can be, exe, jpg, png
    url: string;
    userId: string;
}
