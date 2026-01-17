
import { Types } from "mongoose";

export type TReview = {
    userEmail: string;
    userName: string;
    rating: number;
    feedback: string;
    createdAt: Date;
};

export type TAssignment = {
    title: string;
    description: string;
    marks: number;
    content: string;
    thumbnailUrl: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    dueDate: Date;
    dueTime: string; // Format: "HH:mm" (24-hour format)
    isExpired: boolean;
    isBestAssignment: boolean;
    totalSubmissions: number;
    reviews: TReview[];
    averageRating: number;
    createdBy: {
        name: string;
        email: string;
        role: string;
        profileImage?: string;
    };
    userId?: Types.ObjectId;
    categoryId: Types.ObjectId;
    isDeleted: boolean;
    deletedAt?: Date;
};
