import { model, Schema } from "mongoose";
import { TRoleRequest } from "./roleRequest.interface";

const roleRequestSchema = new Schema<TRoleRequest>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    requestedRole: {
        type: String,
        enum: ['teacher', 'admin'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    reason: {
        type: String,
        required: true,
    },
    adminNote: {
        type: String,
    },
}, {
    timestamps: true,
});

roleRequestSchema.index({ user: 1, status: 1 });

export const RoleRequest = model<TRoleRequest>('RoleRequest', roleRequestSchema);
