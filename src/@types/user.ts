import { Request } from "express";
import { ObjectId } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            user: {
                id: any;
                name: string;
                email: string;
                verified: boolean;
                avatar?: string;
                followers: number;
                followings: number;
            }
        }
    }
}

export interface CreateUserRequest extends Request {
    body: {
        name: string,
        password: string,
        email: string,
    }
}

export interface VerifyEmailRequest extends Request {
    body: {
        token: string,
        userId: string,
    }
}