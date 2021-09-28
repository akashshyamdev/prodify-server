import { model, Model, Schema, Types } from 'mongoose';
import { ITodo } from '../types/todo';

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    due: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    developer: {
      type: Types.ObjectId,
      ref: 'Developer',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Todo: Model<ITodo> = model<ITodo>('Todo', schema);

export default Todo;
