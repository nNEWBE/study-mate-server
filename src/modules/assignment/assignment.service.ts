import { Assignment } from "./assignment.model";
import type { TAssignment } from "./assignment.interface";

const createAssignment = async (payload: TAssignment) => {
    const result = await Assignment.create(payload);
    return result;
};

const getAllAssignments = async () => {
    const result = await Assignment.find();
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
