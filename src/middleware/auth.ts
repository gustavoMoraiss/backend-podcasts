import PasswordResetToken from "#/models/passwordResetToken";
import User from "#/models/user";
import { JWT_SECRET } from "#/utils/variables";
import { error } from "console";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { ObjectId } from "mongoose";

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
    const { token, userId } = req.body;

    const resetToken = await PasswordResetToken.findOne({ owner: userId })
    if (!resetToken) return res.status(403).json({
        error: "Unauthorized access, invalid token."
    })

    const matched = await resetToken?.compareToken(token)
    if (!matched) return res.status(403).json({
        error: "Unauthorized access, invalid token."
    })

    next();
};

export const mustAuth: RequestHandler = async (req, res, next) => {
    const { authorization } = req.headers;

    const token = authorization?.split("Beare ")[1];
    if (!token) return res.status(403).json({
        error: "Unauthorized request."
    })

    const payload = verify(token, JWT_SECRET) as JwtPayload;
    const id = payload.userId;

    const user = await User.findOne({ _id: id, tokens: token });
    if (!user) return res.status(403).json({
        error: "Unauthorized request."
    });

    req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        avatar: user.avatar?.url,
        followers: user.followers.length,
        followings: user.followings.length
    }

    next();
};