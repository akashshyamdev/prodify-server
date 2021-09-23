import { Model, model, Schema, Types } from 'mongoose';
import { INote } from '../types/note';

const schema = new Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    developer: {
      type: Types.ObjectId,
      ref: 'Developer',
    },
    isAudio: {
      type: Boolean,
      default: true,
      required: true,
    },
    audioUrl: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Note: Model<INote> = model<INote>('Note', schema);

export default Note;
