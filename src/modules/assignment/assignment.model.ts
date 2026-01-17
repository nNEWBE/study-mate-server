import { Schema, model } from 'mongoose';
import type { TAssignment } from './assignment.interface';

const reviewSchema = new Schema({
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const assignmentSchema = new Schema<TAssignment>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    marks: { type: Number, required: true },
    content: { type: String, required: true },
    thumbnailUrl: { type: [String], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    dueDate: { type: Date, required: true },
    dueTime: { type: String, required: true, default: '23:59' }, // Format: "HH:mm"
    isExpired: { type: Boolean, default: false },
    isBestAssignment: { type: Boolean, default: false },
    totalSubmissions: { type: Number, default: 0 },
    reviews: { type: [reviewSchema], default: [] },
    averageRating: { type: Number, default: 0 },
    createdBy: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: { type: String, required: true },
        profileImage: { type: String, required: true }
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
}, {
    timestamps: true,
});

// Indexes
assignmentSchema.index({ difficulty: 1 });
assignmentSchema.index({ "createdBy.email": 1 });
assignmentSchema.index({ dueDate: 1 });
assignmentSchema.index({ isExpired: 1 });
assignmentSchema.index({ isBestAssignment: 1 });

// Virtual to check if assignment is expired based on current time
assignmentSchema.methods.checkExpired = function (): boolean {
    const now = new Date();
    const dueDateTime = new Date(this.dueDate);
    const dueTime = this.dueTime || '23:59';

    const timeParts = dueTime.split(':');
    const hours = parseInt(timeParts[0] || '23', 10);
    const minutes = parseInt(timeParts[1] || '59', 10);
    dueDateTime.setHours(hours, minutes, 0, 0);

    return now > dueDateTime;
};

export const Assignment = model<TAssignment>('Assignment', assignmentSchema);
