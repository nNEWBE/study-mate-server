import { Types } from "mongoose";

export type TSubmission = {
    assignmentId: Types.ObjectId;
    studentId: Types.ObjectId;
    assignmentTitle: string;
    studentName: string;
    studentEmail: string;
    submissionLink: string;
    note?: string;
    status: 'pending' | 'graded';
    marks?: number;
    feedback?: string;
    rating?: number;
}
