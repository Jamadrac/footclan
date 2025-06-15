import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  permissions: {
    type: [{
      type: String,
      enum: ['view', 'edit', 'delete']
    }],
    default: ['view']
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure a user can't be added as a member multiple times
memberSchema.index({ owner: 1, member: 1 }, { unique: true });

export default mongoose.model('Member', memberSchema);
