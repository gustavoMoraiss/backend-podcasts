import { CreateUserRequest, VerifyEmailRequest } from "#/@types/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail, sendVerificationPasswordLink } from "#/utils/mail";
import { error } from "console";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import crypto from 'crypto';
import { PASSWORD_RESET_LINK } from "#/utils/variables";
import user from "#/models/user";

export const create: RequestHandler = async (req: CreateUserRequest, res) => {
    const { email, password, name } = req.body;

    const user = User.create({ name, email, password });

    const token = generateToken()

    await EmailVerificationToken.create({
        owner: (await user)._id,
        token
    });

    sendVerificationMail(token, { name, email, userId: (await user)._id.toString() })

    res.status(201).json({ user: { id: (await user)._id, name, email } });
}

export const verifyEmail: RequestHandler = async (req: VerifyEmailRequest, res) => {
    const { token, userId } = req.body;

    const verificationToken = await EmailVerificationToken.findOne({
        owner: userId
    })

    if (!verificationToken) return res.status(403).json({ error: "Invalid token." })

    const matched = await verificationToken?.compareToken(token)

    if (!matched) return res.status(403).json({ error: "Invalid token." })

    await User.findByIdAndUpdate(userId, {
        verified: true
    })

    await EmailVerificationToken.findByIdAndDelete(verificationToken._id)

    res.json({ message: "Your email is verified." })
}

export const sendReverificationToken: RequestHandler = async (req, res) => {
    const { userId } = req.body;

    if (!isValidObjectId(userId)) res.status(403).json({ error: "Invalid request." })

    const user = await User.findById(userId)

    if (!user) res.status(403).json({ error: "Invalid request." })

    await EmailVerificationToken.findOneAndDelete({
        owner: userId
    })

    const token = generateToken()

    await EmailVerificationToken.create({
        owner: userId,
        token
    })

    sendVerificationMail(token, {
        name: user?.name ?? "",
        email: user?.email ?? "",
        userId: user?._id.toString() ?? ""
    })

    res.json({ message: "Please, check your mail." })
}

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
    const { email } = req.body;


    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Account not found!" });

    await PasswordResetToken.findOneAndDelete({
        owner: user._id,
    });

    const token = crypto.randomBytes(36).toString("hex");

    await PasswordResetToken.create({
        owner: user._id,
        token,
    });

    const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

    sendVerificationPasswordLink({ email: user.email, link: resetLink });

    res.json({ message: "Check you registered mail." });
};

export const grantValid: RequestHandler = async (req, res) => {

    res.json({ valid: true });
};