import mongoose, { Schema, Document } from 'mongoose';

export interface IConnection extends Document {
  fromUserId: mongoose.Types.ObjectId;    // user who SENT the request
  toUserId: mongoose.Types.ObjectId;      // user who RECEIVED the request
  type: 'mentor' | 'investor' | 'partner';
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;                       // optional message with request
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema = new Schema<IConnection>(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required'],
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver ID is required'],
    },
    type: {
      type: String,
      required: [true, 'Connection type is required'],
      enum: {
        values: ['mentor', 'investor', 'partner'],
        message: 'Type must be mentor, investor, or partner',
      },
    },
    status: {
      type: String,
      default: 'pending',
      enum: {
        values: ['pending', 'accepted', 'rejected'],
        message: 'Status must be pending, accepted, or rejected',
      },
    },
    message: {
      type: String,
      default: '',
      maxlength: [500, 'Message must be under 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: prevent duplicate requests between the same two users
ConnectionSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

export default mongoose.model<IConnection>('Connection', ConnectionSchema);
