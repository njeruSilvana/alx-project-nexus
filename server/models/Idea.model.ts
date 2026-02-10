import mongoose, { Schema, Document } from 'mongoose';

export interface IIdea extends Document {
  userId: mongoose.Types.ObjectId;       // links to User who created it
  title: string;
  description: string;
  category: string;
  fundingGoal: number;
  currentFunding: number;
  likes: number;
  likedBy: mongoose.Types.ObjectId[];     // tracks WHO liked it (prevents duplicates)
  createdAt: Date;
  updatedAt: Date;
}

const IdeaSchema = new Schema<IIdea>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',                         // references the User model
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title must be at most 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [50, 'Description must be at least 50 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Technology', 'Agriculture', 'Healthcare', 'Education', 'Finance', 'E-commerce', 'Sustainability'],
        message: 'Invalid category',
      },
    },
    fundingGoal: {
      type: Number,
      required: [true, 'Funding goal is required'],
      min: [100, 'Funding goal must be at least $100'],
    },
    currentFunding: {
      type: Number,
      default: 0,
      min: [0, 'Current funding cannot be negative'],
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],                         // array of user IDs who liked this idea
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IIdea>('Idea', IdeaSchema);
