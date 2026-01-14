import { Schema, model } from 'mongoose';
import type { TAssignment } from './assignment.interface';

const assignmentSchema = new Schema<TAssignment>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    marks: { type: Number, required: true },
    content: { type: String, required: true },
    thumbnailUrl: { type: [String], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    dueDate: { type: Date, required: true },
    createdBy: {
        email: { type: String, required: true },
        name: { type: String, required: true }
    }
}, {
    timestamps: true,
});

assignmentSchema.index({ difficulty: 1 });
assignmentSchema.index({ "createdBy.email": 1 });
assignmentSchema.index({ dueDate: 1 });

export const Assignment = model<TAssignment>('Assignment', assignmentSchema);
