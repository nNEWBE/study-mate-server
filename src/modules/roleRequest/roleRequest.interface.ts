import { Types } from "mongoose";

export type TRoleRequest = {
    user: Types.ObjectId;
    requestedRole: 'teacher' | 'admin';
    status: 'pending' | 'approved' | 'rejected';
    reason: string;
    adminNote?: string;
}
