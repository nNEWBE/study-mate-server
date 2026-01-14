import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TRoleRequest } from "./roleRequest.interface";
import { RoleRequest } from "./roleRequest.model";

const createRoleRequest = async (userId: string, payload: Partial<TRoleRequest>) => {
    // Check if user already has a pending request
    const existingRequest = await RoleRequest.findOne({
        user: userId,
        status: 'pending',
    });

    if (existingRequest) {
        throw new AppError('roleRequest', httpStatus.BAD_REQUEST, 'You already have a pending role request');
    }

    const result = await RoleRequest.create({
        ...payload,
        user: userId,
    });

    return result;
};

const getMyRoleRequests = async (userId: string) => {
    const result = await RoleRequest.find({ user: userId }).sort({ createdAt: -1 });
    return result;
};

const getAllRoleRequests = async (status?: string) => {
    const filter: Record<string, unknown> = {};
    if (status) {
        filter.status = status;
    }

    const result = await RoleRequest.find(filter)
        .populate('user', 'name email profileImage role')
        .sort({ createdAt: -1 });
    return result;
};

const updateRoleRequest = async (id: string, payload: { status: 'approved' | 'rejected'; adminNote?: string }) => {
    const roleRequest = await RoleRequest.findById(id);

    if (!roleRequest) {
        throw new AppError('roleRequest', httpStatus.NOT_FOUND, 'Role request not found');
    }

    if (roleRequest.status !== 'pending') {
        throw new AppError('roleRequest', httpStatus.BAD_REQUEST, 'This request has already been processed');
    }

    // If approved, update the user's role
    if (payload.status === 'approved') {
        await User.findByIdAndUpdate(roleRequest.user, {
            role: roleRequest.requestedRole,
        });
    }

    const result = await RoleRequest.findByIdAndUpdate(
        id,
        {
            status: payload.status,
            adminNote: payload.adminNote,
        },
        { new: true }
    );

    return result;
};

export const RoleRequestServices = {
    createRoleRequest,
    getMyRoleRequests,
    getAllRoleRequests,
    updateRoleRequest,
};
