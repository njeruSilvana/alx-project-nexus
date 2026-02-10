
import mongoose, { Schema, Document } from 'mongoose';

/*
  IUser describes how a user looks in TypeScript
*/
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  // ✅ added admin
  role: 'entrepreneur' | 'investor' | 'mentor' | 'admin';

  bio?: string;
  location?: string;
  expertise?: string[];

  createdAt: Date;
  updatedAt: Date;
}

/*
  MongoDB schema
*/
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // ✅ updated role with admin
    role: {
      type: String,
      required: true,
      enum: ['entrepreneur', 'investor', 'mentor', 'admin'],
      default: 'entrepreneur',
    },

    bio: {
      type: String,
      default: '',
    },

    location: {
      type: String,
      default: '',
    },

    expertise: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
