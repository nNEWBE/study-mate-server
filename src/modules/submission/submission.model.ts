import { model, Schema } from "mongoose";
import { TSubmission } from "./submission.interface";

const submissionSchema = new Schema<TSubmission>({
    assignmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true,
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignmentTitle: {
        type: String,
        required: true,
    },
    studentName: {
        type: String,
        required: true,
    },
    studentEmail: {
        type: String,
        required: true,
    },
    submissionLink: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'graded'],
        default: 'pending',
    },
    marks: {
        type: Number,
    },
    feedback: {
        type: String,
    },
    rating: {
        type: Number,
    },
}, {
    timestamps: true,
});

export const Submission = model<TSubmission>('Submission', submissionSchema);
