import { Assignment } from "./assignment.model";
import type { TAssignment } from "./assignment.interface";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { IImageFile } from "../../interface/ImageFile";
import QueryBuilder from "../../builder/QueryBuilder";
import { JwtPayload } from "jsonwebtoken";
import { Category } from "../category/category.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";

// Helper function to parse time string to hours and minutes
const parseTime = (timeStr: string | undefined): { hours: number; minutes: number } => {
    const defaultTime = '23:59';
    const time = timeStr ?? defaultTime;
    const parts = time.split(':');
    const hoursStr = parts[0] ?? '23';
    const minutesStr = parts[1] ?? '59';
    return {
        hours: parseInt(hoursStr, 10) || 23,
        minutes: parseInt(minutesStr, 10) || 59,
    };
};

const createAssignment = async (payload: TAssignment, files?: IImageFile[], user?: JwtPayload) => {
    const category = await Category.findOne({ _id: payload.categoryId, isDeleted: false });
    if (!category) {
        throw new AppError('categoryId', httpStatus.BAD_REQUEST, 'Category not found. Please select a valid category.');
    }

    // Fetch user details from DB to set createdBy
    const userDetails = await User.findById(user?._id);
    if (!userDetails) {
        throw new AppError('user', httpStatus.UNAUTHORIZED, 'User not found.');
    }

    const thumbnailUrls: string[] = [];
    if (files && files.length > 0) {
        for (const file of files) {
            const url = await uploadToCloudinary(file.buffer, 'study-mate/assignments');
            thumbnailUrls.push(url);
        }
    }

    // Check if already expired based on dueDate and dueTime
    const now = new Date();
    const dueDateTime = new Date(payload.dueDate);
    const { hours, minutes } = parseTime(payload.dueTime);
    dueDateTime.setHours(hours, minutes, 0, 0);
    const isExpired = now > dueDateTime;

    const result = await Assignment.create({
        ...payload,
        thumbnailUrl: thumbnailUrls,
        userId: user?._id,
        dueTime: payload.dueTime || '23:59',
        isExpired,
        isBestAssignment: false,
        totalSubmissions: 0,
        createdBy: {
            name: userDetails.name,
            email: userDetails.email,
            role: userDetails.role,
            profileImage: userDetails.profileImage || '',
        },
    });
    return result;
};


const getAllAssignments = async (query: Record<string, unknown>) => {
    // First, update expired status for all assignments
    await updateExpiredAssignments();

    const assignmentQuery = new QueryBuilder(Assignment.find().populate('categoryId'), query)
        .search(['title', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await assignmentQuery.modelQuery;
    return result;
};

const getSingleAssignment = async (id: string) => {
    // Update expired status before fetching
    await updateSingleAssignmentExpiredStatus(id);

    const result = await Assignment.findById(id).populate('categoryId');
    return result;
};

const deleteAssignment = async (id: string) => {
    const result = await Assignment.findByIdAndDelete(id);
    return result;
};

const updateAssignment = async (id: string, payload: Partial<TAssignment>, files?: IImageFile[]) => {
    if (files && files.length > 0) {
        const thumbnailUrls: string[] = [];
        for (const file of files) {
            const url = await uploadToCloudinary(file.buffer, 'study-mate/assignments');
            thumbnailUrls.push(url);
        }
        payload.thumbnailUrl = thumbnailUrls;
    }

    // Remove protected fields from update payload
    const { createdBy, isBestAssignment, totalSubmissions, ...safePayload } = payload as any;

    // Recalculate isExpired if dueDate or dueTime changed
    if (safePayload.dueDate || safePayload.dueTime) {
        const assignment = await Assignment.findById(id);
        if (assignment) {
            const dueDate = safePayload.dueDate ? new Date(safePayload.dueDate) : new Date(assignment.dueDate);
            const dueTime = safePayload.dueTime || assignment.dueTime || '23:59';
            const [hours, minutes] = dueTime.split(':').map(Number);
            dueDate.setHours(hours, minutes, 0, 0);
            safePayload.isExpired = new Date() > dueDate;
        }
    }

    const result = await Assignment.findByIdAndUpdate(id, safePayload, { new: true, upsert: true });
    return result;
};

// Toggle best assignment status (Admin only)
const toggleBestAssignment = async (id: string, isBest: boolean) => {
    const result = await Assignment.findByIdAndUpdate(
        id,
        { isBestAssignment: isBest },
        { new: true }
    );
    return result;
};

// Increment total submissions (called when a submission is made)
const incrementSubmissionCount = async (assignmentId: string) => {
    const result = await Assignment.findByIdAndUpdate(
        assignmentId,
        { $inc: { totalSubmissions: 1 } },
        { new: true }
    );
    return result;
};

// Decrement total submissions (called when a submission is deleted)
const decrementSubmissionCount = async (assignmentId: string) => {
    const result = await Assignment.findByIdAndUpdate(
        assignmentId,
        { $inc: { totalSubmissions: -1 } },
        { new: true }
    );
    // Ensure it doesn't go below 0
    if (result && result.totalSubmissions < 0) {
        await Assignment.findByIdAndUpdate(assignmentId, { totalSubmissions: 0 });
    }
    return result;
};

// Helper: Update expired status for all assignments
const updateExpiredAssignments = async () => {
    const now = new Date();

    // Find all non-expired assignments and check if they should be expired
    const assignments = await Assignment.find({ isExpired: false });

    for (const assignment of assignments) {
        const dueDateTime = new Date(assignment.dueDate);
        const { hours, minutes } = parseTime(assignment.dueTime);
        dueDateTime.setHours(hours, minutes, 0, 0);

        if (now > dueDateTime) {
            await Assignment.findByIdAndUpdate(assignment._id, { isExpired: true });
        }
    }
};

// Helper: Update expired status for a single assignment
const updateSingleAssignmentExpiredStatus = async (id: string) => {
    const assignment = await Assignment.findById(id);
    if (!assignment) return;

    const now = new Date();
    const dueDateTime = new Date(assignment.dueDate);
    const { hours, minutes } = parseTime(assignment.dueTime);
    dueDateTime.setHours(hours, minutes, 0, 0);

    const shouldBeExpired = now > dueDateTime;

    if (assignment.isExpired !== shouldBeExpired) {
        await Assignment.findByIdAndUpdate(id, { isExpired: shouldBeExpired });
    }
};

// Get best assignments only
const getBestAssignments = async () => {
    await updateExpiredAssignments();
    const result = await Assignment.find({ isBestAssignment: true }).populate('categoryId');
    return result;
};

// Add Review
const addReview = async (id: string, user: JwtPayload | undefined, rating: number, feedback: string) => {
    if (!user) {
        throw new AppError('user', httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    const assignment = await Assignment.findById(id);
    if (!assignment) {
        throw new AppError('assignmentId', httpStatus.NOT_FOUND, "Assignment not found");
    }

    // Fetch user details to get name
    const userDetails = await User.findOne({ email: user.email });
    if (!userDetails) {
        throw new AppError('email', httpStatus.NOT_FOUND, "User not found");
    }

    // Validation: Creator cannot review their own assignment
    if (assignment.createdBy.email === userDetails.email) {
        throw new AppError('email', httpStatus.FORBIDDEN, "You cannot review your own assignment");
    }

    // Validation: Check if user already reviewed
    const existingReview = assignment.reviews?.find(r => r.userEmail === userDetails.email);
    if (existingReview) {
        throw new AppError('user', httpStatus.BAD_REQUEST, "You have already reviewed this assignment");
    }

    const newReview = {
        userEmail: userDetails.email,
        userName: userDetails.name,
        rating,
        feedback,
        createdAt: new Date(),
    };

    // Recalculate average (append new rating to existing ones)
    const currentReviews = assignment.reviews || [];
    const totalRating = currentReviews.reduce((sum, r) => sum + r.rating, 0) + rating;
    const newAverage = totalRating / (currentReviews.length + 1);

    const result = await Assignment.findByIdAndUpdate(
        id,
        {
            $push: { reviews: newReview },
            averageRating: Number(newAverage.toFixed(1))
        },
        { new: true }
    );
    return result;
};

export const AssignmentServices = {
    createAssignment,
    getAllAssignments,
    getSingleAssignment,
    deleteAssignment,
    updateAssignment,
    toggleBestAssignment,
    incrementSubmissionCount,
    decrementSubmissionCount,
    getBestAssignments,
    addReview,
};
