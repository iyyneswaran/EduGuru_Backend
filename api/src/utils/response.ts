import { Response } from "express"

export function successResponse(
    res: Response,
    data: any,
    message = "Success"
) {
    return res.status(200).json({
        success: true,
        message,
        data
    })
}

export function errorResponse(
    res: Response,
    message = "Something went wrong",
    status = 500
) {
    return res.status(status).json({
        success: false,
        message
    })
}