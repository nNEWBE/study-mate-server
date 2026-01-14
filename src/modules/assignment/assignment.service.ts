import { Assignment } from "./assignment.model";
import type { TAssignment } from "./assignment.interface";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { IImageFile } from "../../interface/ImageFile";
import QueryBuilder from "../../builder/QueryBuilder";
import { JwtPayload } from "jsonwebtoken";

const createAssignment = async (payload: TAssignment, files?: IImageFile[], user?: JwtPayload) => {
    const thumbnailUrls: string[] = [];
    if (files && files.length > 0) {
        for (const file of files) {
            const url = await uploadToCloudinary(file.path, 'study-mate/assignments');
            thumbnailUrls.push(url);
        }
    }

    const result = await Assignment.create({
        ...payload,
        thumbnailUrl: thumbnailUrls,
        userId: user?._id,
    });
    return result;
};


const getAllAssignments = async (query: Record<string, unknown>) => {
    const assignmentQuery = new QueryBuilder(Assignment.find(), query)
        .search(['title', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await assignmentQuery.modelQuery;
    return result;
};

const getSingleAssignment = async (id: string) => {
    const result = await Assignment.findById(id);
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
            const url = await uploadToCloudinary(file.path, 'study-mate/assignments');
            thumbnailUrls.push(url);
        }
        payload.thumbnailUrl = thumbnailUrls;
    }

    // Remove protected fields from update payload
    const { createdBy, ...safePayload } = payload as any;

    const result = await Assignment.findByIdAndUpdate(id, safePayload, { new: true, upsert: true });
    return result;
};

export const AssignmentServices = {
    createAssignment,
    getAllAssignments,
    getSingleAssignment,
    deleteAssignment,
    updateAssignment,
};
