import { compare, hash } from 'bcryptjs';
import { Model, model, Schema } from 'mongoose';
import { IDeveloper } from '../types/developer';

const schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please specify your first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please specify your last name'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please specify an email'],
    },
    password: {
      type: String,
      required: [true, 'Please specify a password'],
    },
    usage: [
      {
        url: {
          type: String,
          required: false,
        },
        time: {
          type: Number,
          required: false,
        },
      },
    ],
    createdAt: {
      type: String,
      default: Date.now(),
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

schema.virtual('userName').get(function (this: IDeveloper) {
  return this.firstName + this.lastName;
});

schema.pre<IDeveloper>('save', async function (next) {
  this.password = await hash(this.password, 12);

  next();
});

schema.methods.comparePasswords = async function (candidatePassword: string, correctPassword: string) {
  return compare(candidatePassword, correctPassword);
};

const Developer: Model<IDeveloper> = model<IDeveloper>('Developer', schema);

export default Developer;
