import { Submission } from "./submission.model";
import { TSubmission } from "./submission.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { AssignmentServices } from "../assignment/assignment.service";

import { Assignment } from "../assignment/assignment.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createSubmission = async (payload: TSubmission) => {
    // Check if assignment exists
    const assignment = await Assignment.findById(payload.assignmentId);
    if (!assignment) {
        throw new AppError('assignmentId', httpStatus.NOT_FOUND, "Assignment not found");
    }

    // Check if user is the creator
    if (assignment.createdBy.email === payload.studentEmail) {
        throw new AppError('email', httpStatus.FORBIDDEN, "You cannot submit your own assignment");
    }

    const result = await Submission.create(payload);

    // Increment total submissions count for the assignment
    if (payload.assignmentId) {
        await AssignmentServices.incrementSubmissionCount(payload.assignmentId.toString());
    }

    return result;
};


const getAllSubmissions = async (query: Record<string, unknown>) => {
    const submissionQuery = new QueryBuilder(Submission.find(), query)
        .search(['assignmentTitle', 'studentName', 'studentEmail'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await submissionQuery.modelQuery;
    return result;
};

const getMySubmissions = async (email: string) => {
    const result = await Submission.find({ studentEmail: email });
    return result;
}

const getSingleSubmission = async (id: string) => {
    const result = await Submission.findById(id);
    return result;
}

const updateSubmission = async (id: string, payload: Partial<TSubmission>) => {
    const result = await Submission.findByIdAndUpdate(id, payload, { new: true });
    return result;
};

const deleteSubmission = async (id: string) => {
    // Get the submission first to get the assignmentId
    const submission = await Submission.findById(id);

    if (submission && submission.assignmentId) {
        // Decrement total submissions count for the assignment
        await AssignmentServices.decrementSubmissionCount(submission.assignmentId.toString());
    }

    const result = await Submission.findByIdAndDelete(id);
    return result;
};

export const SubmissionServices = {
    createSubmission,
    getAllSubmissions,
    getMySubmissions,
    getSingleSubmission,
    updateSubmission,
    deleteSubmission,
};
