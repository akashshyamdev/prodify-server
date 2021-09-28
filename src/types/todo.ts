import { Document } from 'mongoose';
import { IDeveloper } from './developer';

export interface ITodo extends Document {
  _id: string;
  title: string;
  due: Date;
  isCompleted: boolean;
  developer: IDeveloper;
}
