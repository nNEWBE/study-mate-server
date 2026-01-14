import { Assignment } from "./assignment.model";
import type { TAssignment } from "./assignment.interface";

const createAssignment = async (payload: TAssignment) => {
    const result = await Assignment.create(payload);
    return result;
};

import QueryBuilder from "../../builder/QueryBuilder";

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

const updateAssignment = async (id: string, payload: Partial<TAssignment>) => {
    const result = await Assignment.findByIdAndUpdate(id, payload, { new: true, upsert: true });
    return result;
};

export const AssignmentServices = {
    createAssignment,
    getAllAssignments,
    getSingleAssignment,
    deleteAssignment,
    updateAssignment,
};
