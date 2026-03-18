import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['chat', 'research', 'references'],
    default: 'chat',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
