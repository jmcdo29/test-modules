import { Document } from 'mongoose';

/**
 *  Declaring the Interface Category
 */
export interface ICategory extends Document {
    created: Date;
    name: string;
    description: string;
}
