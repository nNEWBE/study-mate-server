/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string; // Optional - social login users might not have password
    role: "admin" | "student" | "teacher";
    phone?: string;
    address?: string;
    city?: string;
    isBlocked: boolean;
    profileImage?: string;
    providers: ("google" | "github" | "password")[]; // Array of providers
}


export interface UserModel extends Model<IUser> {
    isUserExistsByEmail(email: string): Promise<IUser>;
    isUserExistsById(id: Types.ObjectId | string): Promise<IUser>;

    isPasswordMatched(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean>;

}

export type TUserRole = keyof typeof USER_ROLE;
