import { Submission } from "./submission.model";
import { TSubmission } from "./submission.interface";

const createSubmission = async (payload: TSubmission) => {
    const result = await Submission.create(payload);
    return result;
};

import QueryBuilder from "../../builder/QueryBuilder";

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

export const SubmissionServices = {
    createSubmission,
    getAllSubmissions,
    getMySubmissions,
    getSingleSubmission,
    updateSubmission,
};
