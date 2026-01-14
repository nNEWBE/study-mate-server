
import { Types } from "mongoose";

export type TAssignment = {
    title: string;
    description: string;
    marks: number;
    content: string;
    thumbnailUrl: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    dueDate: Date;
    createdBy: {
        name: string;
        email: string;
        role: string;
        profileImage?: string;
    };
    userId?: Types.ObjectId;
};
