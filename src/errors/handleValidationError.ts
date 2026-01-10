import mongoose from "mongoose";
import { TDetails, TGenericErrorResponse } from "../interface/error";
import httpStatus from "http-status";

const handleValidationError = (error: mongoose.Error.ValidationError): TGenericErrorResponse => {
    const issues: TDetails[] = Object.values(error.errors).map((el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
        return {
            path: el?.path,
            message: el?.message,
        }
    })
    const statusCode = httpStatus.BAD_REQUEST;
    return {
        statusCode,
        message: 'Validation Error',
        issues
    }
}

export default handleValidationError;