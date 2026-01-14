import { Types } from "mongoose";

export type TWishlist = {
    user: Types.ObjectId;
    assignment: Types.ObjectId;
}
