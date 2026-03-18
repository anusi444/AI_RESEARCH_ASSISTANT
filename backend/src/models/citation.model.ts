import mongoose, { Document, Schema } from 'mongoose';

export interface ICitation extends Document {
  title: string;
  authors: string[];
  journal?: string;
  year?: number;
  doi?: string;
  url?: string;
  abstract?: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const citationSchema = new Schema<ICitation>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  authors: [{
    type: String,
    required: true,
    trim: true
  }],
  journal: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  },
  doi: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  abstract: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const Citation = mongoose.model<ICitation>('Citation', citationSchema);
