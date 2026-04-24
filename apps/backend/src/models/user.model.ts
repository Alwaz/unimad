import mongoose, { type Document, Schema } from 'mongoose';

// TODO: rename this file to program.model.ts and update the model accordingly,
// this is just a placeholder model for users, replace it with actual fields for programs
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// programSchema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret['id'] = String(ret['_id']);
        delete ret['_id'];
        delete ret['__v'];
        return ret;
      },
    },
  },
);

// ProgramModel
export const UserModel = mongoose.model<IUser>('User', userSchema);
